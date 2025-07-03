import DefaultAvatar from '@renderer/assets/images/avatar.png'
import EmojiAvatar from '@renderer/components/Avatar/EmojiAvatar'
import useAvatar from '@renderer/hooks/useAvatar'
import { useSettings } from '@renderer/hooks/useSettings'
import ImageStorage from '@renderer/services/ImageStorage'
import { useAppDispatch } from '@renderer/store'
import { setAvatar } from '@renderer/store/runtime'
import { setUserName } from '@renderer/store/settings'
import { compressImage, downloadImageFromUrl, isEmoji, isValidImageUrl } from '@renderer/utils'
import { Avatar, Dropdown, Input, Modal, Popover, Upload } from 'antd'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import EmojiPicker from '../EmojiPicker'
import { Center, HStack, VStack } from '../Layout'
import { TopView } from '../TopView'

interface Props {
  resolve: (data: any) => void
}

const PopupContainer: React.FC<Props> = ({ resolve }) => {
  const [open, setOpen] = useState(true)
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [urlInputVisible, setUrlInputVisible] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [urlLoading, setUrlLoading] = useState(false)
  const { t } = useTranslation()
  const { userName } = useSettings()
  const dispatch = useAppDispatch()
  const avatar = useAvatar()

  const onOk = () => {
    setOpen(false)
  }

  const onCancel = () => {
    setOpen(false)
  }

  const onClose = () => {
    resolve({})
  }

  const handleEmojiClick = async (emoji: string) => {
    try {
      // set emoji string
      await ImageStorage.set('avatar', emoji)
      // update avatar display
      dispatch(setAvatar(emoji))
      setEmojiPickerOpen(false)
    } catch (error: any) {
      window.message.error(error.message)
    }
  }
  const handleReset = async () => {
    try {
      await ImageStorage.set('avatar', DefaultAvatar)
      dispatch(setAvatar(DefaultAvatar))
      setDropdownOpen(false)
    } catch (error: any) {
      window.message.error(error.message)
    }
  }

  const handleUrlSubmit = async () => {
    if (!imageUrl.trim()) {
      window.message.error(t('settings.general.avatar.url_required'))
      return
    }

    if (!isValidImageUrl(imageUrl)) {
      window.message.error(t('settings.general.avatar.invalid_url'))
      return
    }

    setUrlLoading(true)
    try {
      const base64Image = await downloadImageFromUrl(imageUrl)
      await ImageStorage.set('avatar', base64Image)
      dispatch(setAvatar(base64Image))
      setUrlInputVisible(false)
      setImageUrl('')
      setDropdownOpen(false)
      window.message.success(t('settings.general.avatar.url_success'))
    } catch (error: any) {
      console.error('Error setting avatar from URL:', error)
      window.message.error(t('settings.general.avatar.url_error'))
    } finally {
      setUrlLoading(false)
    }
  }
  const items = [
    {
      key: 'upload',
      label: (
        <div style={{ width: '100%', textAlign: 'center' }}>
          <Upload
            customRequest={() => {}}
            accept="image/png, image/jpeg, image/gif"
            itemRender={() => null}
            maxCount={1}
            onChange={async ({ file }) => {
              try {
                const _file = file.originFileObj as File
                if (_file.type === 'image/gif') {
                  await ImageStorage.set('avatar', _file)
                } else {
                  const compressedFile = await compressImage(_file)
                  await ImageStorage.set('avatar', compressedFile)
                }
                dispatch(setAvatar(await ImageStorage.get('avatar')))
                setDropdownOpen(false)
              } catch (error: any) {
                window.message.error(error.message)
              }
            }}>
            {t('settings.general.image_upload')}
          </Upload>
        </div>
      )
    },
    {
      key: 'emoji',
      label: (
        <div
          style={{ width: '100%', textAlign: 'center' }}
          onClick={(e) => {
            e.stopPropagation()
            setEmojiPickerOpen(true)
            setDropdownOpen(false)
          }}>
          {t('settings.general.emoji_picker')}
        </div>
      )
    },
    {
      key: 'url',
      label: (
        <div
          style={{ width: '100%', textAlign: 'center' }}
          onClick={(e) => {
            e.stopPropagation()
            setUrlInputVisible(true)
            setDropdownOpen(false)
          }}>
          {t('settings.general.avatar.url_input')}
        </div>
      )
    },
    {
      key: 'reset',
      label: (
        <div
          style={{ width: '100%', textAlign: 'center' }}
          onClick={(e) => {
            e.stopPropagation()
            handleReset()
          }}>
          {t('settings.general.avatar.reset')}
        </div>
      )
    }
  ]

  return (
    <Modal
      width="300px"
      open={open}
      footer={null}
      onOk={onOk}
      onCancel={onCancel}
      afterClose={onClose}
      transitionName="animation-move-down"
      centered>
      <Center mt="30px">
        <VStack alignItems="center" gap="10px">
          <Dropdown
            menu={{ items }}
            trigger={['click']}
            open={dropdownOpen}
            align={{ offset: [0, 4] }}
            placement="bottom"
            onOpenChange={(visible) => {
              setDropdownOpen(visible)
              if (visible) {
                setEmojiPickerOpen(false)
              }
            }}>
            <Popover
              content={<EmojiPicker onEmojiClick={handleEmojiClick} />}
              trigger="click"
              open={emojiPickerOpen}
              onOpenChange={(visible) => {
                setEmojiPickerOpen(visible)
                if (visible) {
                  setDropdownOpen(false)
                }
              }}
              placement="bottom">
              {isEmoji(avatar) ? (
                <EmojiAvatar size={80} fontSize={40}>
                  {avatar}
                </EmojiAvatar>
              ) : (
                <UserAvatar src={avatar} />
              )}
            </Popover>
          </Dropdown>
        </VStack>
      </Center>
      <HStack alignItems="center" gap="10px" p="20px">
        <Input
          placeholder={t('settings.general.user_name.placeholder')}
          value={userName}
          onChange={(e) => dispatch(setUserName(e.target.value.trim()))}
          style={{ flex: 1, textAlign: 'center', width: '100%' }}
          maxLength={30}
        />
      </HStack>
      {urlInputVisible && (
        <VStack gap="10px" p="0 20px 20px">
          <Input
            placeholder={t('settings.general.avatar.url_placeholder')}
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value.trim())}
            onPressEnter={handleUrlSubmit}
            style={{ width: '100%' }}
          />
          <HStack gap="10px" justifyContent="center">
            <button
              onClick={handleUrlSubmit}
              disabled={urlLoading || !imageUrl.trim()}
              style={{
                padding: '4px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                background: urlLoading || !imageUrl.trim() ? '#f5f5f5' : '#1890ff',
                color: urlLoading || !imageUrl.trim() ? '#999' : '#fff',
                cursor: urlLoading || !imageUrl.trim() ? 'not-allowed' : 'pointer'
              }}>
              {urlLoading ? t('common.loading') : t('common.confirm')}
            </button>
            <button
              onClick={() => {
                setUrlInputVisible(false)
                setImageUrl('')
              }}
              style={{
                padding: '4px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                background: '#fff',
                color: '#666',
                cursor: 'pointer'
              }}>
              {t('common.cancel')}
            </button>
          </HStack>
        </VStack>
      )}
    </Modal>
  )
}

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  width: 80px;
  height: 80px;
  transition: opacity 0.3s ease;
  &:hover {
    opacity: 0.8;
  }
`

export default class UserPopup {
  static topviewId = 0
  static hide() {
    TopView.hide('UserPopup')
  }
  static show() {
    return new Promise<any>((resolve) => {
      TopView.show(
        <PopupContainer
          resolve={(v) => {
            resolve(v)
            this.hide()
          }}
        />,
        'UserPopup'
      )
    })
  }
}
