import app from './app.js'
import seedTestUser from './seedTestUser.js'

const port = process.env.PORT || 3000

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`)
})

// luo test userin envistä
seedTestUser().catch((error) => {
  console.error('Testikäyttäjän luonti epäonnistui:', error.message)
})
