import app from './app.js'

// envistä jwt etc
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET puuttuu')
}

const port = process.env.PORT || 3000

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`)
})
