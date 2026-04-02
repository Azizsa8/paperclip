'use client'

import { useState } from 'react'
import { Rocket, Upload, Sparkles } from 'lucide-react'

export default function LaunchPage() {
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    price: '',
    targetAudience: '',
    campaignGoal: 'brand-awareness',
    budget: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Launching campaign:', formData)
    alert('Campaign launched! The 32 agents are now working...')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-card gold-border-top p-8">
        <div className="flex items-center gap-3 mb-6">
          <Rocket className="text-accent" size={28} />
          <div>
            <h1 className="text-2xl font-heading font-bold text-text-primary">Launch Campaign</h1>
            <p className="text-sm text-text-secondary">Fill 7 boxes. Watch the gods work.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Box 1: Product Image */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              1. Product Image
            </label>
            <div className="border-2 border-dashed border-gold-border/30 rounded-lg p-8 text-center hover:border-accent/50 transition-colors cursor-pointer">
              <Upload className="mx-auto text-text-secondary mb-2" size={32} />
              <p className="text-sm text-text-secondary">Drop image here or click to upload</p>
            </div>
          </div>

          {/* Box 2: Product Name */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              2. Product Name
            </label>
            <input
              type="text"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-gold-border/20 rounded-lg text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none"
              placeholder="Enter product name"
            />
          </div>

          {/* Box 3: Product Description */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              3. Product Description
            </label>
            <textarea
              value={formData.productDescription}
              onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-background border border-gold-border/20 rounded-lg text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none resize-none"
              placeholder="What does it do? What problem does it solve?"
            />
          </div>

          {/* Box 4: Price */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              4. Price Point
            </label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-gold-border/20 rounded-lg text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none"
              placeholder="$29.99/month or Free/Freemium/Premium"
            />
          </div>

          {/* Box 5: Target Audience */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              5. Target Audience
            </label>
            <textarea
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-background border border-gold-border/20 rounded-lg text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none resize-none"
              placeholder="Who are you selling to? Be specific!"
            />
          </div>

          {/* Box 6: Campaign Goal */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              6. Campaign Goal
            </label>
            <select
              value={formData.campaignGoal}
              onChange={(e) => setFormData({ ...formData, campaignGoal: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-gold-border/20 rounded-lg text-text-primary focus:border-accent focus:outline-none"
            >
              <option value="brand-awareness">Brand Awareness</option>
              <option value="lead-generation">Lead Generation</option>
              <option value="sales">Sales / Conversions</option>
              <option value="app-downloads">App Downloads</option>
              <option value="community">Community Building</option>
            </select>
          </div>

          {/* Box 7: Budget */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              7. Budget (Optional)
            </label>
            <input
              type="text"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-gold-border/20 rounded-lg text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none"
              placeholder="$2000 or 'Let the gods decide'"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 bg-accent text-background font-heading font-bold rounded-lg hover:bg-accent-hover transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles size={20} />
            UNLEASH THE GODS MARKETING
          </button>
        </form>
      </div>
    </div>
  )
}
