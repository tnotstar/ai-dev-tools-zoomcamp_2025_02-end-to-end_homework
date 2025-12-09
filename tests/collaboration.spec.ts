import { test, expect } from '@playwright/test';

test.describe('Real-time Code Synchronization', () => {
  test('Two users can sync code in real-time', async ({ browser }) => {
    // Step 1: Create two separate browser contexts (User A and User B)
    const contextA = await browser.newContext();
    const contextB = await browser.newContext();
    
    const pageA = await contextA.newPage();
    const pageB = await contextB.newPage();

    // Step 2: User A navigates to the app and generates a Room ID
    await pageA.goto('/');
    await expect(pageA.getByText('Coding Interview Platform')).toBeVisible();
    
    // Create new room
    await pageA.getByRole('button', { name: 'Create New Interview Room' }).click();
    
    // Wait for room to load and get the room URL
    await expect(pageA).toHaveURL(/\/room\/.+/);
    const roomUrl = pageA.url();
    
    // Step 3: User B navigates to that exact same Room URL
    await pageB.goto(roomUrl);
    
    // Check that both users are connected
    await expect(pageA.getByText('Connected')).toBeVisible();
    await expect(pageB.getByText('Connected')).toBeVisible();

    // Step 4: User A types console.log("Hello World") into the Monaco Editor
    // Monaco editor is tricky to target, usually we click into the line content
    const editorSelector = '.monaco-editor .view-lines';
    
    await pageA.locator(editorSelector).click();
    await pageA.keyboard.type('console.log("Hello World");');
    
    // Wait for the change to propagate
    await pageA.waitForTimeout(500); // Small wait for socket emission

    // Step 5: ASSERT that User B's editor content automatically updates
    // We check the content of the lines in User B's editor
    await expect(pageB.locator(editorSelector)).toContainText('console.log("Hello World");');
    
    // Clean up
    await contextA.close();
    await contextB.close();
  });
});
