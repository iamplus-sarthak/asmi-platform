import { GlobalConfig } from 'payload'

const PlatformAnalytics: GlobalConfig = {
  slug: 'platform_analytics',
  admin: {
    group: 'Analytics',
  },
  access: {
    read: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'retention_rate',
      type: 'number',
      label: 'Retention Rate (%)',
      defaultValue: 0,
    },
    {
      name: 'retention_rate_change',
      type: 'text',
      label: 'Retention Rate Change',
      defaultValue: '0%',
    },
    {
      name: 'retention_trend',
      type: 'select',
      options: [
        { label: 'Up', value: 'up' },
        { label: 'Down', value: 'down' },
      ],
      defaultValue: 'up',
    },
    {
      name: 'avg_session_duration',
      type: 'text',
      label: 'Avg Session Duration',
      defaultValue: '0m 0s',
    },
    {
      name: 'pages_per_session',
      type: 'number',
      label: 'Pages Per Session',
      defaultValue: 0,
    },
    {
      name: 'bounce_rate',
      type: 'number',
      label: 'Bounce Rate (%)',
      defaultValue: 0,
    },
    {
      name: 'tool_usage',
      type: 'array',
      label: 'Tool Usage',
      fields: [
        {
          name: 'tool',
          type: 'text',
          required: true,
        },
        {
          name: 'uses',
          type: 'number',
          required: true,
        },
        {
          name: 'percentage',
          type: 'number',
          required: true,
        },
      ],
      defaultValue: []
    },
  ],
}

export default PlatformAnalytics
