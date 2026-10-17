import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getUserDetails } from '@/db/pg'
import AccountClientView from '@/components/AccountClientView'
import type { Metadata } from 'next'
import { VALUES } from '@/lib/values'

export const metadata: Metadata = {
  title: 'Account',
  description: `Manage your ${VALUES.APP_NAME} account credentials and API key.`,
  robots: { index: false, follow: false },
}

export default async function AccountPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const user = await getUserDetails(session.email)

  if (!user) {
    redirect('/login')
  }

  const serializedUser = {
    email: user.email,
    fullName: user.fullName,
    apiKey: user.apiKey,
    joinDate: user.joinDate ? user.joinDate.toString() : null,
    apiKeyUpdateTime: user.apiKeyUpdateTime
      ? user.apiKeyUpdateTime.toString()
      : null,
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex justify-center px-4 py-12 items-start">
      <AccountClientView user={serializedUser} />
    </div>
  )
}
