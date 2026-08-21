#!/usr/bin/env python3
"""
Solar Feasibility & Rooftop Area Estimator Prototype
CLI Tool to compute rooftop solar potential from street addresses.
"""

import sys
import os
import argparse
import json
import numpy as np

# Reconfigure stdout for UTF-8 on Windows
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from dotenv import load_dotenv
from rich.console import Console
from rich.table import Table
from rich.panel import Panel

# Load environment variables
load_dotenv()

from core.geocoder import geocode_address
from core.resolution import calculate_ground_resolution, calculate_pixel_area
from core.imagery import fetch_satellite_image
from core.segmentation import get_segmenter
from core.solar_math import calculate_solar_capacity
from core.visualization import annotate_solar_feasibility
from core.depth_estimation import estimate_depth_map, filter_mask_with_depth

console = Console()

def run_solar_estimator(
    address: str,
    zoom: int = 19,
    segmenter_method: str = "opencv",
    output_path: str = "output_annotated.png",
    depth_output_path: str = "depth_map.png",
    as_json: bool = False
):
    if not as_json:
        console.print(Panel.fit("[bold yellow]Solar Feasibility & Rooftop Area Estimator[/bold yellow]"))
        console.print(f"[bold cyan]Geocoding address:[/bold cyan] {address}")

    # 1. Geocoding
    lat, lng, full_address = geocode_address(address)
    
    # 2. Ground Resolution
    res = calculate_ground_resolution(lat, zoom)
    pixel_area = calculate_pixel_area(res)
    
    # 3. Satellite Imagery Ingestion
    if not as_json:
        console.print(f"[bold cyan]Fetching satellite tile...[/bold cyan] (lat: {lat:.4f}, lng: {lng:.4f}, z: {zoom})")
    tile_image = fetch_satellite_image(lat, lng, zoom=zoom, size=600)
    
    # 4. Monocular Pseudo-LiDAR Depth Estimation
    if not as_json:
        console.print(f"[bold cyan]Generating Pseudo-LiDAR Depth Elevation Map...[/bold cyan]")
    depth_normalized, depth_visual = estimate_depth_map(tile_image)
    depth_visual.save(depth_output_path)
    
    # 5. Roof Segmentation & Depth Elevation Filter
    if not as_json:
        console.print(f"[bold cyan]Segmenting rooftop using:[/bold cyan] {segmenter_method.upper()} + Depth Height Filter")
    segmenter = get_segmenter(segmenter_method)
    raw_mask = segmenter(tile_image)
    
    # Refine mask by filtering out low-elevation ground / backyard pixels
    mask = filter_mask_with_depth(raw_mask, depth_normalized, threshold_percentile=35.0)
    mask_pixel_count = int(np.sum(mask > 0))
    
    # 6. Solar Capacity Math
    estimate = calculate_solar_capacity(mask_pixel_count, pixel_area)
    
    # 7. Visual Annotation
    annotated = annotate_solar_feasibility(
        base_image=tile_image,
        mask=mask,
        address=full_address,
        lat=lat,
        lng=lng,
        resolution=res,
        estimate=estimate
    )
    annotated.save(output_path)
    
    # Output formatting
    results = {
        "address": full_address,
        "coordinates": {"latitude": lat, "longitude": lng},
        "zoom": zoom,
        "ground_resolution_m_per_px": round(res, 4),
        "pixel_area_m2": round(pixel_area, 4),
        "raw_roof_area_m2": estimate.raw_roof_area,
        "usable_roof_area_m2": estimate.usable_roof_area,
        "max_400w_panels": estimate.max_panels,
        "system_capacity_kw": estimate.system_capacity_kw,
        "output_image": output_path,
        "depth_map_image": depth_output_path
    }
    
    if as_json:
        print(json.dumps(results, indent=2))
    else:
        table = Table(title="Solar Feasibility Summary", show_header=True, header_style="bold magenta")
        table.add_column("Parameter / Metric", style="cyan")
        table.add_column("Value", style="bold green")
        
        lat_dir = "S" if lat < 0 else "N"
        lng_dir = "W" if lng < 0 else "E"
        coord_str = f"{abs(lat):.5f} {lat_dir}, {abs(lng):.5f} {lng_dir}"

        table.add_row("Full Address", full_address)
        table.add_row("Coordinates", coord_str)
        table.add_row("Ground Resolution", f"{res:.3f} m / pixel")
        table.add_row("Raw Roof Area", f"{estimate.raw_roof_area:.2f} m2")
        table.add_row("Usable Solar Area (65%)", f"{estimate.usable_roof_area:.2f} m2")
        table.add_row("Max 400W Solar Panels", f"{estimate.max_panels} units")
        table.add_row("Estimated Peak Capacity", f"{estimate.system_capacity_kw:.2f} kW")
        
        console.print(table)
        console.print(f"\n[bold green][OK] Visual verification image saved to:[/bold green] [yellow]{output_path}[/yellow]")
        console.print(f"[bold green][OK] Pseudo-LiDAR depth elevation map saved to:[/bold green] [yellow]{depth_output_path}[/yellow]")
        
    return results

def main():
    parser = argparse.ArgumentParser(description="Solar Feasibility & Rooftop Area Estimator Prototype")
    parser.add_argument(
        "address",
        type=str,
        nargs="?",
        default=None,
        help="Target street address or lat,lng coordinates (default: University of Wollongong, Australia)"
    )
    parser.add_argument("--coords", type=str, default=None, help="Direct lat,lng coordinates (e.g. '-33.72951, 150.99442')")
    parser.add_argument("--lat", type=float, default=None, help="Direct latitude coordinate")
    parser.add_argument("--lng", type=float, default=None, help="Direct longitude coordinate")
    parser.add_argument("--zoom", type=int, default=19, help="Satellite zoom level (default: 19)")
    parser.add_argument("--segmenter", type=str, choices=["opencv", "gemini"], default="opencv", help="Roof segmentation method")
    parser.add_argument("--output", type=str, default="output_annotated.png", help="Output annotated image path")
    parser.add_argument("--depth-output", type=str, default="depth_map.png", help="Output depth map image path")
    parser.add_argument("--json", action="store_true", help="Output results in JSON format")
    
    args = parser.parse_args()
    
    # Determine input query
    if args.lat is not None and args.lng is not None:
        target_query = f"{args.lat}, {args.lng}"
    elif args.coords:
        target_query = args.coords
    elif args.address:
        target_query = args.address
    else:
        target_query = "University of Wollongong, Northfields Ave, Wollongong NSW 2522, Australia"
    
    try:
        run_solar_estimator(
            address=target_query,
            zoom=args.zoom,
            segmenter_method=args.segmenter,
            output_path=args.output,
            depth_output_path=args.depth_output,
            as_json=args.json
        )
    except Exception as e:
        console.print(f"[bold red]Error:[/bold red] {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
