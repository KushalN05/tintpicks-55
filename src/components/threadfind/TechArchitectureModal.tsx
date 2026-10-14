import React, { useState } from 'react';
import { X, Database, Cpu, Layers, GitBranch, Terminal, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { SearchMode } from '@/types/threadfind';

interface TechArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchMode: SearchMode;
  onToggleSearchMode: () => void;
}

export const TechArchitectureModal: React.FC<TechArchitectureModalProps> = ({
  isOpen,
  onClose,
  searchMode,
  onToggleSearchMode,
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'pgvector' | 'scoring'>('pipeline');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#E6E2DC] overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E6E2DC] bg-[#FAF9F6] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-md bg-[#285C47] text-white flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-editorial text-xl text-[#191919]">
                ThreadFind Visual Search Architecture
              </h3>
              <p className="text-xs text-[#77736F]">
                Technical specifications, pgvector implementation, and calibration model.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md hover:bg-[#E6E2DC] text-[#77736F]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Toggle Banner */}
        <div className="bg-[#E8EFE9] px-6 py-3 flex items-center justify-between border-b border-[#285C47]/15">
          <div className="flex items-center space-x-2 text-xs text-[#285C47]">
            <span className="font-semibold">Active Engine Mode:</span>
            <span className="px-2 py-0.5 rounded-full bg-white font-mono text-[11px] font-bold">
              {searchMode === 'demo' ? 'Deterministic Seeded Demo' : 'Live Vector Search (pgvector)'}
            </span>
          </div>

          <button
            type="button"
            onClick={onToggleSearchMode}
            className="text-xs font-semibold px-3 py-1 rounded bg-[#285C47] text-white hover:bg-[#1F4A39] transition-colors"
          >
            Switch to {searchMode === 'demo' ? 'pgvector Mode' : 'Demo Mode'}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E6E2DC] bg-white px-6">
          <button
            type="button"
            onClick={() => setActiveTab('pipeline')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'pipeline'
                ? 'border-[#285C47] text-[#285C47]'
                : 'border-transparent text-[#77736F] hover:text-[#191919]'
            }`}
          >
            End-to-End Visual Pipeline
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pgvector')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'pgvector'
                ? 'border-[#285C47] text-[#285C47]'
                : 'border-transparent text-[#77736F] hover:text-[#191919]'
            }`}
          >
            Postgres + pgvector Schema
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('scoring')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'scoring'
                ? 'border-[#285C47] text-[#285C47]'
                : 'border-transparent text-[#77736F] hover:text-[#191919]'
            }`}
          >
            Calibration & Reranking Strategy
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-[#191919] leading-relaxed">
          {activeTab === 'pipeline' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-[#FAF9F6] border border-[#E6E2DC]">
                  <span className="font-bold text-[#285C47] block mb-1">1. Query Preprocessing</span>
                  <p className="text-[#77736F]">
                    Image input validation, canvas aspect-ratio preservation, user garment crop isolation.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-[#FAF9F6] border border-[#E6E2DC]">
                  <span className="font-bold text-[#285C47] block mb-1">2. Vision Embedding</span>
                  <p className="text-[#77736F]">
                    Vision Transformer (CLIP ViT-B/32 or equivalent) maps garment imagery into high-dimensional vector space.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-[#FAF9F6] border border-[#E6E2DC]">
                  <span className="font-bold text-[#285C47] block mb-1">3. Nearest Neighbor Search</span>
                  <p className="text-[#77736F]">
                    HNSW index evaluates cosine distance against 10,000+ pre-indexed catalogue garment vectors.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-[#FAF9F6] border border-[#E6E2DC]">
                  <span className="font-bold text-[#285C47] block mb-1">4. Grounded Reranking</span>
                  <p className="text-[#77736F]">
                    Attribute alignment bonus (lapel, hardware, stripe frequency) refines top ranking order.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#FAF9F6] border border-[#E6E2DC] space-y-2">
                <h4 className="font-semibold text-sm text-[#191919]">Why Visual Search vs Keyword Search?</h4>
                <p className="text-[#77736F]">
                  Traditional eCommerce search fails when shoppers see a piece on street style or TikTok without knowing brand or product nomenclature. Keyword search for "brown jacket" returns 5,000 generic coats. ThreadFind's visual embedding isolates the exact notch lapel cut, distressed patina, and asymmetric zip pull to rank indistinguishable matches #1.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'pgvector' && (
            <div className="space-y-4">
              <p className="text-[#77736F]">
                ThreadFind utilizes PostgreSQL with the <code>pgvector</code> extension for sub-50ms candidate retrieval over precomputed product image embeddings:
              </p>

              <pre className="p-4 rounded-lg bg-[#191919] text-[#FAF9F6] font-mono text-[11px] overflow-x-auto leading-relaxed">
{`-- Enable the pgvector extension in PostgreSQL / Supabase
CREATE EXTENSION IF NOT EXISTS vector;

-- Product catalogue table storing metadata & 512-dim visual embeddings
CREATE TABLE catalogue_products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'GBP',
  merchant TEXT NOT NULL,
  product_url TEXT,
  colour TEXT NOT NULL,
  pattern TEXT NOT NULL,
  attributes JSONB DEFAULT '{}',
  image_embedding vector(512),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- HNSW Index for ultra-fast approximate nearest neighbour search
CREATE INDEX idx_products_embedding ON catalogue_products
USING hnsw (image_embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Query execution for nearest visual matches using Cosine Distance:
SELECT 
  id, 
  title, 
  brand, 
  price, 
  image_url,
  1 - (image_embedding <=> $1::vector) AS cosine_similarity
FROM catalogue_products
WHERE category = COALESCE($2, category)
ORDER BY image_embedding <=> $1::vector
LIMIT 24;`}
              </pre>
            </div>
          )}

          {activeTab === 'scoring' && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-[#FAF9F6] border border-[#E6E2DC] space-y-2">
                <h4 className="font-semibold text-sm text-[#191919]">The 95% Claim & Calibration Principle</h4>
                <p className="text-[#77736F]">
                  A raw cosine similarity of 0.95 in a multimodal embedding space does not mathematically equate to a 95% probability of physical garment identity. To maintain venture-grade rigor:
                </p>
                <ul className="list-disc list-inside space-y-1 text-[#77736F] pl-2">
                  <li><strong>Raw Cosine Distance</strong> is retained in the internal search response contract.</li>
                  <li><strong>Calibrated Match Score</strong> uses a piece-wise transfer function normalized across verified benchmark pairs.</li>
                  <li><strong>Clear Tier Categorization</strong>: Only products with verified SKU alignment receive <em>"Exact item"</em>; visually indistinguishable pieces are labeled <em>"Near-identical" (95%+)</em> or <em>"Very close match" (90%+)</em>.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FAF9F6] border-t border-[#E6E2DC] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-[#285C47] text-white text-xs font-semibold hover:bg-[#1F4A39]"
          >
            Close Architecture Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
