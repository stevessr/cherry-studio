import { NavbarRight } from '@renderer/components/app/Navbar'
import { HStack } from '@renderer/components/Layout'
import { isWindows } from '@renderer/config/constant'
import { Button, Dropdown, type MenuProps } from 'antd'
import { ChevronDown, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import styled from 'styled-components'

import InstallNpxUv from './InstallNpxUv'

const mcpResources = [
  {
    name: 'Model Context Protocol servers',
    url: 'https://github.com/modelcontextprotocol/servers',
    logo: 'https://avatars.githubusercontent.com/u/182288589'
  },
  {
    name: 'Awesome MCP Servers',
    url: 'https://awesome-mcp-servers.com',
    logo: 'https://github.githubassets.com/assets/github-logo-55c5b9a1fe52.png'
  },
  {
    name: 'mcp.so',
    url: 'https://mcp.so/',
    logo: 'https://mcp.so/favicon.ico'
  },
  {
    name: 'modelscope.cn',
    url: 'https://www.modelscope.cn/mcp',
    logo: 'https://g.alicdn.com/sail-web/maas/2.7.35/favicon/128.ico'
  },
  {
    name: 'mcp.higress.ai',
    url: 'https://mcp.higress.ai/',
    logo: 'https://framerusercontent.com/images/FD5yBobiBj4Evn0qf11X7iQ9csk.png'
  },
  {
    name: 'smithery.ai',
    url: 'https://smithery.ai/',
    logo: 'https://smithery.ai/logo.svg'
  },
  {
    name: 'glama.ai',
    url: 'https://glama.ai/mcp/servers',
    logo: 'https://glama.ai/favicon.ico'
  },
  {
    name: 'pulsemcp.com',
    url: 'https://www.pulsemcp.com',
    logo: 'https://www.pulsemcp.com/favicon.svg'
  },
  {
    name: 'mcp.composio.dev',
    url: 'https://www.composio.dev/',
    logo: 'https://composio.dev/wp-content/uploads/2025/02/Fevicon-composio.png'
  }
]

export const McpSettingsNavbar = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleMenuClick = (url: string) => {
    window.open(url, '_blank')
  }

  const resourceMenuItems: MenuProps['items'] = mcpResources.map((resource) => ({
    key: resource.name,
    label: (
      <ResourceMenuItem onClick={() => handleMenuClick(resource.url)}>
        <ResourceLogo src={resource.logo} alt={resource.name} />
        {resource.name}
      </ResourceMenuItem>
    )
  }))

  return (
    <NavbarRight style={{ paddingRight: isWindows ? 150 : 12 }}>
      <HStack alignItems="center" gap={5}>
        <Button
          size="small"
          type="text"
          onClick={() => navigate('/settings/mcp/npx-search')}
          icon={<Search size={14} />}
          className="nodrag"
          style={{ fontSize: 13, height: 28, borderRadius: 20 }}>
          {t('settings.mcp.searchNpx')}
        </Button>
        <Dropdown
          menu={{ items: resourceMenuItems }}
          trigger={['click']}
          overlayStyle={{ maxHeight: '400px', overflow: 'auto' }}>
          <ResourcesButton
            size="small"
            type="text"
            className="nodrag"
            style={{ fontSize: 13, height: 28, borderRadius: 20 }}>
            {t('settings.mcp.findMore')}
            <ChevronDown size={14} style={{ marginLeft: 5 }} />
          </ResourcesButton>
        </Dropdown>
        <InstallNpxUv mini />
      </HStack>
    </NavbarRight>
  )
}

const ResourcesButton = styled(Button)`
  display: flex;
  align-items: center;
`

const ResourceMenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  cursor: pointer;
`

const ResourceLogo = styled.img`
  width: 16px;
  height: 16px;
  object-fit: contain;
  border-radius: 3px;
`
