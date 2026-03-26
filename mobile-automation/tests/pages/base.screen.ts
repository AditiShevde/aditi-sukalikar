import { browser } from '@wdio/globals';

export abstract class BaseScreen {
    protected async tapByViewportPercent(xPercent: number, yPercent: number): Promise<void> {
        const { width, height } = await browser.getWindowSize();
        const x = Math.round(width * xPercent);
        const y = Math.round(height * yPercent);

        await browser.performActions([
            {
                type: 'pointer',
                id: 'finger1',
                parameters: { pointerType: 'touch' },
                actions: [
                    { type: 'pointerMove', duration: 0, origin: 'viewport', x, y },
                    { type: 'pointerDown', button: 0 },
                    { type: 'pointerUp', button: 0 }
                ]
            }
        ]);
        await browser.releaseActions();
    }
}

