# Test info

- Name: Homepage >> should validate username field requirements
- Location: /Users/stevendiamante/personal/code-ancestry/tests/homepage.spec.ts:76:7

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: getByText('Username is required')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for getByText('Username is required')

    at /Users/stevendiamante/personal/code-ancestry/tests/homepage.spec.ts:87:58
```

# Page snapshot

```yaml
- alert
- button "Open Next.js Dev Tools":
  - img
- button "Open issues overlay": 1 Issue
- button "Collapse issues badge":
  - img
- heading "Join the Evolution" [level=1]
- paragraph: Create an account to share your refactorings
- text: Email
- textbox "Email": test@example.com
- text: Username
- textbox "Username"
- paragraph: 3-30 characters, letters, numbers, underscore, and hyphen only
- text: Password
- textbox "Password": password123
- button "Sign Up"
- button "Already have an account? Sign in"
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test'
   2 |
   3 | test.describe('Homepage', () => {
   4 |   test('should load homepage successfully', async ({ page }) => {
   5 |     await page.goto('/')
   6 |     
   7 |     // Check for main heading
   8 |     await expect(page.getByText('CodeAncestry')).toBeVisible()
   9 |     
   10 |     // Check for landing page elements
   11 |     await expect(page.getByText('Where Code Evolves')).toBeVisible()
   12 |     await expect(page.getByText('Start Refactoring')).toBeVisible()
   13 |   })
   14 |
   15 |   test('should navigate to refactor creation page', async ({ page }) => {
   16 |     await page.goto('/')
   17 |     
   18 |     // Click start refactoring button
   19 |     await page.getByText('Start Refactoring').click()
   20 |     
   21 |     // Should navigate to /refactor/new
   22 |     await expect(page).toHaveURL(/\/refactor\/new/)
   23 |     
   24 |     // Check for upload interface
   25 |     await expect(page.getByText('Share Your Code Evolution')).toBeVisible()
   26 |     await expect(page.getByText('Before')).toBeVisible()
   27 |   })
   28 |
   29 |   test('should show authentication prompt when creating refactoring', async ({ page }) => {
   30 |     await page.goto('/refactor/new')
   31 |     
   32 |     // Should show auth prompt
   33 |     await expect(page.getByText('Ready to Share Your Evolution?')).toBeVisible()
   34 |     await expect(page.getByText('Sign Up')).toBeVisible()
   35 |     await expect(page.getByText('Continue Browsing')).toBeVisible()
   36 |   })
   37 |
   38 |   test('should navigate to login page', async ({ page }) => {
   39 |     await page.goto('/refactor/new')
   40 |     
   41 |     // Click sign up button in auth prompt
   42 |     await page.getByText('Sign Up').click()
   43 |     
   44 |     // Should navigate to login page
   45 |     await expect(page).toHaveURL(/\/auth\/login/)
   46 |     
   47 |     // Check for login form elements
   48 |     await expect(page.getByText('Join the Evolution')).toBeVisible()
   49 |     await expect(page.getByText('Email')).toBeVisible()
   50 |     await expect(page.getByText('Username')).toBeVisible()
   51 |     await expect(page.getByText('Password')).toBeVisible()
   52 |   })
   53 |
   54 |   test('should toggle between sign up and sign in modes', async ({ page }) => {
   55 |     await page.goto('/auth/login')
   56 |     
   57 |     // Should start in sign up mode
   58 |     await expect(page.getByText('Join the Evolution')).toBeVisible()
   59 |     await expect(page.getByText('Username')).toBeVisible()
   60 |     
   61 |     // Click to switch to sign in
   62 |     await page.getByText('Already have an account? Sign in').click()
   63 |     
   64 |     // Should switch to sign in mode
   65 |     await expect(page.getByText('Welcome Back')).toBeVisible()
   66 |     await expect(page.getByText('Username')).not.toBeVisible()
   67 |     
   68 |     // Click to switch back to sign up
   69 |     await page.getByText("Don't have an account? Sign up").click()
   70 |     
   71 |     // Should switch back to sign up mode
   72 |     await expect(page.getByText('Join the Evolution')).toBeVisible()
   73 |     await expect(page.getByText('Username')).toBeVisible()
   74 |   })
   75 |
   76 |   test('should validate username field requirements', async ({ page }) => {
   77 |     await page.goto('/auth/login')
   78 |     
   79 |     // Fill in email and password
   80 |     await page.getByLabel('Email').fill('test@example.com')
   81 |     await page.getByLabel('Password').fill('password123')
   82 |     
   83 |     // Try to submit without username
   84 |     await page.getByText('Sign Up').click()
   85 |     
   86 |     // Should show validation error
>  87 |     await expect(page.getByText('Username is required')).toBeVisible()
      |                                                          ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
   88 |     
   89 |     // Fill username with invalid characters
   90 |     await page.getByLabel('Username').fill('test user!')
   91 |     await page.getByText('Sign Up').click()
   92 |     
   93 |     // Should show validation error for invalid characters
   94 |     await expect(page.getByText('Username can only contain letters, numbers, underscores, and hyphens')).toBeVisible()
   95 |     
   96 |     // Fill username too short
   97 |     await page.getByLabel('Username').fill('te')
   98 |     await page.getByText('Sign Up').click()
   99 |     
  100 |     // Should show validation error for length
  101 |     await expect(page.getByText('Username must be between 3 and 30 characters')).toBeVisible()
  102 |   })
  103 |
  104 |   test('should show random evolution button', async ({ page }) => {
  105 |     await page.goto('/')
  106 |     
  107 |     // Check for random evolution button
  108 |     await expect(page.getByText('🎲')).toBeVisible()
  109 |     await expect(page.getByText('Random Evolution')).toBeVisible()
  110 |   })
  111 | })
```