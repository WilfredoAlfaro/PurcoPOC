import{expect,selectors,type Locator, type Page} from '@playwright/test';
import { faker } from '@faker-js/faker';
import { takeScreenshot } from '../helpers/errorFunctions.ts';

class RenterClaimOverview{
    readonly page : Page
    readonly makeaPaymentButton : Locator;
    readonly noteButton: Locator;
    readonly noteLabel : Locator;
    readonly noteTextBox: Locator;
    readonly textNote: string;
    readonly addNoteButton: Locator;
    readonly cancelButton: Locator;
    readonly newNote: Locator;


    constructor(page : Page){
        this.page = page
        this.makeaPaymentButton = page.getByText('Make a Payment');
        this.noteButton = page.locator('//button[@class="mantine-UnstyledButton-root mantine-ActionIcon-root mantine-pw7wng"]');
        this.noteLabel = page.getByText('New Note');
        this.noteTextBox = page.getByPlaceholder('Type a note...');
        this.textNote = faker.lorem.paragraph();
        this.addNoteButton = page.getByText('Add Note');
        this.cancelButton = page.getByText('Cancel');
        this.newNote = page.locator('//div[@class="mantine-Text-root css-1f6ey70 mantine-nrd89"]')
    }

    async clickMakeaPaymentButton(): Promise<void>{
        try{
        await expect(this.makeaPaymentButton).toBeVisible();
        await this.makeaPaymentButton.click();
        }catch (error) {
            console.error('Test failed:', error);
            // Take a screenshot if the test fails
            await takeScreenshot(this.page, 'Make a Payment button');
            throw error; // Re-throw the error to ensure the test fails
        }
    }

    async claimoverviewUrlValidation(url : string): Promise<void>{
        try{
        await expect(this.page).toHaveURL(url);
        }catch (error) {
            console.error('Test failed:', error);
            throw error; // Re-throw the error to ensure the test fails
        }

    }

    async clickNotesButton(): Promise<void>{
        try{
            await expect(this.noteButton).toBeVisible();
            await this.noteButton.click();
            await expect(this.noteLabel).toContainText('New Note');
        }catch (error) {
            console.error('Test failed:', error);
            // Take a screenshot if the test fails
            await takeScreenshot(this.page, 'Click to Add Note');
            throw error; // Re-throw the error to ensure the test fails
        }
    }

    async notesDrawerAddNote(): Promise<void>{
        try{
            await expect(this.noteTextBox).toBeEditable();
            await this.noteTextBox.fill(this.textNote);
            await expect(this.addNoteButton).toBeVisible();
            await this.addNoteButton.click();
        }catch (error) {
            console.error('Test failed:', error);
            // Take a screenshot if the test fails
            await takeScreenshot(this.page, 'Notes Drawer');
            throw error; // Re-throw the error to ensure the test fails
        }
    }

    async validateNewNoteCreated(): Promise<void>{
        try{
            const text =  this.textNote;
            await expect(this.newNote).toBeVisible();
            await expect(this.newNote).toContainText(text);
        }catch (error) {
            console.error('Test failed:', error);
            // Take a screenshot if the test fails
            await takeScreenshot(this.page, 'New note should be created');
            throw error; // Re-throw the error to ensure the test fails
        }
    }






}
export default RenterClaimOverview