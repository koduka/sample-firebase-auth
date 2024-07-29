'use client'

import { AccountIcon } from '@/libs/components/AccountIcon'
import { AccountData } from '@/libs/data/account'
import { formatTimestamp } from '@/libs/utils'

type AccountInfoProps = {
  account?: AccountData
}

export function AccountInfo({ account }: AccountInfoProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <AccountIcon src={account?.iconBase64} />
      </div>
      <div className="space-y-2">
        <div className="grid grid-cols-2">
          <span>名前</span>
          <span>{account?.name}</span>
        </div>
        <div className="grid grid-cols-2">
          <span>メールアドレス</span>
          <span>{account?.email}</span>
        </div>
        <div className="grid grid-cols-2">
          <span>住所</span>
          <span>{account?.homeAddress}</span>
        </div>
        <div className="grid grid-cols-2">
          <span>作成日時</span>
          <span>{formatTimestamp(account?.createdAt)}</span>
        </div>
        <div className="grid grid-cols-2">
          <span>更新日時</span>
          <span>{formatTimestamp(account?.updatedAt)}</span>
        </div>
      </div>
    </div>
  )
}
