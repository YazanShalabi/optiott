import React from 'react'

import { getDictionaryFromDisplaySettings } from '@/lib/utils'
import { TeamMemberStyling } from './TeamMemberStyling'
import Image from 'next/image'

const TeamMemberBlock: React.FC<any> = ({ data, displaySettings }) => {
  const settings = getDictionaryFromDisplaySettings(displaySettings)
  const styles = TeamMemberStyling(settings)

  const photoUrl = (data.Photo as any)?.url?.default ?? (data.Photo as any)?.url ?? ''

  const socialLinks = [
    { url: data.FacebookUrl, label: 'Facebook', icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
    { url: data.TwitterUrl, label: 'Twitter', icon: 'M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0012 7.47v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5 0-.28-.03-.56-.08-.83A7.72 7.72 0 0023 3z' },
    { url: data.LinkedInUrl, label: 'LinkedIn', icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 2a2 2 0 110 4 2 2 0 010-4z' },
    { url: data.InstagramUrl, label: 'Instagram', icon: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2m7.7 2A3.8 3.8 0 0020 7.8v8.4a3.8 3.8 0 01-3.8 3.8H7.8A3.8 3.8 0 014 16.2V7.8A3.8 3.8 0 017.8 4h8.4M16.5 6.5a1 1 0 100 2 1 1 0 000-2M12 7a5 5 0 100 10 5 5 0 000-10m0 2a3 3 0 110 6 3 3 0 010-6z' },
  ].filter(link => link.url)

  return (
    <div className={styles.card} data-epi-block-id={data._metadata?.key}>
      <div className={styles.imageWrapper}>
        {photoUrl && (
          <Image src={photoUrl} alt={data.Name ?? ''} fill className={styles.image} />
        )}
      </div>
      <h3 className={styles.name} data-epi-edit="Name">
        {data.Name}
      </h3>
      <p className={styles.role} data-epi-edit="Role">
        {data.Role}
      </p>
      <div className={styles.socialLinks}>
        {socialLinks.map((link, i) => (
          <a
            key={i}
            href={link.url as string}
            className={styles.socialLink}
            aria-label={link.label}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={link.icon} />
            </svg>
          </a>
        ))}
      </div>
    </div>
  )
}

TeamMemberBlock.displayName = 'TeamMemberBlock'
export default TeamMemberBlock
