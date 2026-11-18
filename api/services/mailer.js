import { EmailClient } from '@azure/communication-email'

// spostin palautus linkit salasanalle

const sendPasswordResetEmail = async (to, link, minutes) => {
  const connectionString = process.env.ACS_CONNECTION_STRING
  if (!connectionString) {
    console.log(`Salasanan palautuslinkki (${to}): ${link}`)
    return
  }

  const client = new EmailClient(connectionString)
  await client.beginSend({
    senderAddress: process.env.MAIL_FROM,
    recipients: { to: [{ address: to }] },
    content: {
      subject: 'Salasanan palautus',
      plainText: `Palauta salasanasi tästä linkistä: ${link}\n\nLinkki on voimassa ${minutes} minuuttia. Jos et pyytänyt palautusta, voit jättää tämän viestin huomiotta.`,
      html: `<p>Palauta salasanasi tästä linkistä: <a href="${link}">${link}</a></p><p>Linkki on voimassa ${minutes} minuuttia. Jos et pyytänyt palautusta, voit jättää tämän viestin huomiotta.</p>`
    }
  })
}

export { sendPasswordResetEmail }
