import React from 'react'

import { getDictionaryFromDisplaySettings } from '@/lib/utils'
import { ContactFormStyling } from './ContactFormStyling'

const ContactFormBlock: React.FC<any> = ({ data, displaySettings }) => {
  const settings = getDictionaryFromDisplaySettings(displaySettings)
  const styles = ContactFormStyling(settings)

  return (
    <section className={styles.section} data-epi-block-id={data._metadata?.key}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title} data-epi-edit="Title">
            {data.Title}
          </h2>
          {data.Description && (
            <p className={styles.description} data-epi-edit="Description">
              {data.Description}
            </p>
          )}
        </div>
        <form className={styles.form}>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>First Name</label>
              <input type="text" className={styles.input} placeholder="Your first name" />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Last Name</label>
              <input type="text" className={styles.input} placeholder="Your last name" />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input type="email" className={styles.input} placeholder="Your email address" />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Subject</label>
            <input type="text" className={styles.input} placeholder="Subject" />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Message</label>
            <textarea className={styles.textarea} placeholder="Your message" />
          </div>
          <button type="submit" className={styles.submitButton}>
            Send Message
          </button>
        </form>
      </div>
    </section>
  )
}

ContactFormBlock.displayName = 'ContactFormBlock'
export default ContactFormBlock
