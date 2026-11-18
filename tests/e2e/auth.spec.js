import { expect, test } from '@playwright/test'

// uudelleen ajo fix
const uniqueUser = () => {
  const id = `${Date.now()}${Math.floor(Math.random() * 1000)}`
  return { username: `testi${id}`, email: `testi${id}@example.com`, password: 'salasana123' }
}

const fillRegisterForm = async (page, user) => {
  await page.goto('/register')
  // csrf tulee backendin /api/tests pyynnöstä
  await page.waitForFunction(() => document.cookie.includes('csrf_token='))
  await page.locator('input[name="username"]').fill(user.username)
  await page.locator('input[name="email"]').fill(user.email)
  await page.locator('input[name="password"]').fill(user.password)
  await page.getByRole('button', { name: 'Rekisteröidy' }).click()
}

test('register through the form lands on the login page', async ({ page }) => {
  // tili
  const user = uniqueUser()

  await fillRegisterForm(page, user)

  await expect(page).toHaveURL(/\/login$/)
})

test('login through the form lands on the home page', async ({ page }) => {
  // kirjautuminen
  const user = uniqueUser()
  await fillRegisterForm(page, user)
  await expect(page).toHaveURL(/\/login$/)

  await page.locator('input[name="identifier"]').fill(user.username)
  await page.locator('input[name="password"]').fill(user.password)
  await page.getByRole('button', { name: 'Kirjaudu' }).click()

  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { name: 'Top movies:' })).toBeVisible()
})

test('logout returns the navbar to the login link', async ({ page }) => {
  const user = uniqueUser()
  await fillRegisterForm(page, user)
  await page.locator('input[name="identifier"]').fill(user.username)
  await page.locator('input[name="password"]').fill(user.password)
  await page.getByRole('button', { name: 'Kirjaudu' }).click()

  await page.getByRole('button', { name: 'Logout' }).click()

  await expect(page.getByRole('link', { name: 'Login' })).toBeVisible()
})
