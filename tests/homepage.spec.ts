import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')
    
    // Check for main heading
    await expect(page.getByText('CodeAncestry')).toBeVisible()
    
    // Check for landing page elements
    await expect(page.getByText('Where Code Evolves')).toBeVisible()
    await expect(page.getByText('Start Refactoring')).toBeVisible()
  })

  test('should navigate to refactor creation page', async ({ page }) => {
    await page.goto('/')
    
    // Click start refactoring button
    await page.getByText('Start Refactoring').click()
    
    // Should navigate to /refactor/new
    await expect(page).toHaveURL(/\/refactor\/new/)
    
    // Check for upload interface
    await expect(page.getByText('Share Your Code Evolution')).toBeVisible()
    await expect(page.getByText('Before')).toBeVisible()
  })

  test('should show authentication prompt when creating refactoring', async ({ page }) => {
    await page.goto('/refactor/new')
    
    // Should show auth prompt
    await expect(page.getByText('Ready to Share Your Evolution?')).toBeVisible()
    await expect(page.getByText('Sign Up')).toBeVisible()
    await expect(page.getByText('Continue Browsing')).toBeVisible()
  })

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/refactor/new')
    
    // Click sign up button in auth prompt
    await page.getByText('Sign Up').click()
    
    // Should navigate to login page
    await expect(page).toHaveURL(/\/auth\/login/)
    
    // Check for login form elements
    await expect(page.getByText('Join the Evolution')).toBeVisible()
    await expect(page.getByText('Email')).toBeVisible()
    await expect(page.getByText('Username')).toBeVisible()
    await expect(page.getByText('Password')).toBeVisible()
  })

  test('should toggle between sign up and sign in modes', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Should start in sign up mode
    await expect(page.getByText('Join the Evolution')).toBeVisible()
    await expect(page.getByText('Username')).toBeVisible()
    
    // Click to switch to sign in
    await page.getByText('Already have an account? Sign in').click()
    
    // Should switch to sign in mode
    await expect(page.getByText('Welcome Back')).toBeVisible()
    await expect(page.getByText('Username')).not.toBeVisible()
    
    // Click to switch back to sign up
    await page.getByText("Don't have an account? Sign up").click()
    
    // Should switch back to sign up mode
    await expect(page.getByText('Join the Evolution')).toBeVisible()
    await expect(page.getByText('Username')).toBeVisible()
  })

  test('should validate username field requirements', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Fill in email and password
    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Password').fill('password123')
    
    // Try to submit without username
    await page.getByText('Sign Up').click()
    
    // Should show validation error
    await expect(page.getByText('Username is required')).toBeVisible()
    
    // Fill username with invalid characters
    await page.getByLabel('Username').fill('test user!')
    await page.getByText('Sign Up').click()
    
    // Should show validation error for invalid characters
    await expect(page.getByText('Username can only contain letters, numbers, underscores, and hyphens')).toBeVisible()
    
    // Fill username too short
    await page.getByLabel('Username').fill('te')
    await page.getByText('Sign Up').click()
    
    // Should show validation error for length
    await expect(page.getByText('Username must be between 3 and 30 characters')).toBeVisible()
  })

  test('should show random evolution button', async ({ page }) => {
    await page.goto('/')
    
    // Check for random evolution button
    await expect(page.getByText('🎲')).toBeVisible()
    await expect(page.getByText('Random Evolution')).toBeVisible()
  })
})