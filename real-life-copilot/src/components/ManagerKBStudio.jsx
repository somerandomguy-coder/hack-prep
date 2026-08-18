import React, { useState } from 'react';
import { UploadCloud, FileText, Plus, CheckCircle, RefreshCw, Layers, Database, Sparkles } from 'lucide-react';
import { getActiveSOPs, addManagerSOP, resetToDefaults } from '../services/ragEngine.js';

export default function ManagerKBStudio({ onSOPsUpdated }) {
  const [sops, setSops] = useState(getActiveSOPs());
  const [manualTitle, setManualTitle] = useState('');
  const [manualCategory, setManualCategory] = useState('Recipes');
  const [manualContent, setManualContent] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [activeTabChunk, setActiveTabChunk] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const newSop = {
        id: `uploaded-${Date.now()}`,
        category: "Uploaded Manual",
        title: file.name.replace(/\.[^/.]+$/, ""),
        lastUpdated: new Date().toISOString().split('T')[0],
        content: text,
        metadata: {
          tags: ["custom", "uploaded", "manager"],
          steps: [
            { title: "Standard Procedure", desc: "Custom uploaded document manual instructions." }
          ],
          warning: "Verify standard safety compliance before executing manual steps."
        }
      };

      const updated = addManagerSOP(newSop);
      setSops(updated);
      if (onSOPsUpdated) onSOPsUpdated();
    };

    reader.readAsText(file);
  };

  const handleCreateManual = (e) => {
    e.preventDefault();
    if (!manualTitle.trim() || !manualContent.trim()) return;

    const newSop = {
      id: `manual-${Date.now()}`,
      category: manualCategory,
      title: manualTitle,
      lastUpdated: new Date().toISOString().split('T')[0],
      content: manualContent,
      metadata: {
        tags: [manualCategory.toLowerCase(), "custom", "manager"],
        steps: [
          { title: "Operational Execution", desc: manualContent.substring(0, 100) + "..." }
        ]
      }
    };

    const updated = addManagerSOP(newSop);
    setSops(updated);
    setManualTitle('');
    setManualContent('');
    setShowUploadForm(false);
    if (onSOPsUpdated) onSOPsUpdated();
  };

  const handleReset = () => {
    if (confirm('Reset Knowledge Base to default Coffee Shop Barista SOPs?')) {
      const resetList = resetToDefaults();
      setSops(resetList);
      if (onSOPsUpdated) onSOPsUpdated();
    }
  };

  return (
    <div className="glass-card manager-studio">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database color="var(--primary-cyan)" size={24} />
            <h2 style={{ fontSize: '1.5rem', color: '#ffffff' }}>Manager Knowledge Base Studio</h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Upload workplace manuals, recipes, & error troubleshooting guides for instant client-side RAG indexing.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button className="btn-secondary" onClick={handleReset} title="Reset to default Barista SOP dataset">
            <RefreshCw size={16} /> Reset Defaults
          </button>
          <button className="btn-primary" onClick={() => setShowUploadForm(!showUploadForm)}>
            <Plus size={16} /> {showUploadForm ? 'Close Editor' : 'Add New SOP'}
          </button>
        </div>
      </div>

      {showUploadForm && (
        <form onSubmit={handleCreateManual} style={{ padding: '1.5rem', background: 'rgba(11, 15, 25, 0.7)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border-hover)' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-cyan)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} /> Add Custom SOP Document
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label">SOP Title / Document Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Cold Brew Nitrogen Machine Maintenance"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-input"
                value={manualCategory}
                onChange={(e) => setManualCategory(e.target.value)}
                style={{ cursor: 'pointer' }}
              >
                <option value="Recipes">Recipes & Prep</option>
                <option value="Equipment Repair">Equipment Repair</option>
                <option value="Safety & Compliance">Safety & Compliance</option>
                <option value="Warehouse & Logistics">Warehouse & Logistics</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Document Content / Instructions Text</label>
            <textarea
              className="form-input"
              rows={6}
              placeholder="Paste manual text, recipes, error code resolution steps..."
              value={manualContent}
              onChange={(e) => setManualContent(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
            <button type="submit" className="btn-primary">
              <CheckCircle size={16} /> Index Document into RAG
            </button>
          </div>
        </form>
      )}

      {/* Drag & Drop File Upload */}
      <div className="dropzone" onClick={() => document.getElementById('sop-file-input').click()}>
        <input
          id="sop-file-input"
          type="file"
          accept=".txt,.md,.json,.pdf"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <UploadCloud size={40} color="var(--primary-cyan)" style={{ marginBottom: '0.5rem' }} />
        <h4 style={{ fontSize: '1.1rem', color: '#ffffff' }}>Drag & drop workplace PDF / TXT manual</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          Supports instant text parsing and local vector indexing (Zero server upload needed)
        </p>
      </div>

      {/* Active Knowledge Base Cards List */}
      <div>
        <h3 className="studio-section-title">
          <Layers size={20} color="var(--accent-purple)" />
          Indexed Workplace SOPs ({sops.length})
        </h3>

        <div className="preset-cards-grid">
          {sops.map((sop) => (
            <div key={sop.id} className="preset-card glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="sop-badge">{sop.category}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Updated: {sop.lastUpdated}</span>
              </div>

              <h4 style={{ fontSize: '1.1rem', color: '#ffffff', fontWeight: '600' }}>{sop.title}</h4>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineClamp: 3, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {sop.content.replace(/\n+/g, ' ')}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
                {(sop.metadata?.tags || []).map((tag, idx) => (
                  <span key={idx} style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.5rem', borderRadius: '12px', color: 'var(--text-muted)' }}>
                    #{tag}
                  </span>
                ))}
              </div>

              <button
                className="btn-secondary"
                style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem', fontSize: '0.8rem', justifyContent: 'center' }}
                onClick={() => setActiveTabChunk(activeTabChunk === sop.id ? null : sop.id)}
              >
                <FileText size={14} /> {activeTabChunk === sop.id ? 'Hide Full Content' : 'View Chunk Context'}
              </button>

              {activeTabChunk === sop.id && (
                <div style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.4)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: '#cbd5e1', maxHeight: '180px', overflowY: 'auto', whiteSpace: 'pre-wrap', marginTop: '0.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {sop.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
