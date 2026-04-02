export default function IntelligencePage() {
  const skills = [
    { name: 'Market Research', type: 'research', source: 'internal', agents: ['Market Researcher', 'Competitor Analyst'] },
    { name: 'Content Creation', type: 'creative', source: 'internal', agents: ['Content Creator', 'Copywriter Supreme'] },
    { name: 'Social Posting', type: 'execution', source: 'internal', agents: ['Social Media Manager'] },
    { name: 'Analytics', type: 'analytics', source: 'internal', agents: ['Data Analyst', 'Behavior Analyst'] },
    { name: 'Psychology', type: 'creative', source: 'internal', agents: ['Psychology Master'] },
    { name: 'Campaign Planning', type: 'strategy', source: 'internal', agents: ['Campaign Strategist'] },
    { name: 'Persona Development', type: 'research', source: 'internal', agents: ['Persona Architect'] },
    { name: 'Paid Media', type: 'execution', source: 'internal', agents: ['Paid Media Specialist'] },
    { name: 'SEO', type: 'execution', source: 'internal', agents: ['SEO Specialist'] },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-heading font-semibold text-text-primary">Intelligence Space</h2>
      
      <div className="grid grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div key={skill.name} className="glass-card gold-border-top p-4">
            <h3 className="font-heading font-semibold text-text-primary mb-1">{skill.name}</h3>
            <p className="text-xs text-text-secondary mb-3">Type: {skill.type} | Source: {skill.source}</p>
            <div className="flex flex-wrap gap-1">
              {skill.agents.map((agent) => (
                <span key={agent} className="px-2 py-0.5 rounded-full text-xs bg-accent/10 text-accent">
                  {agent}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
