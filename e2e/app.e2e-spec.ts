import { GsmfrontendPage } from './app.po';

describe('gsmfrontend App', function() {
  let page: GsmfrontendPage;

  beforeEach(() => {
    page = new GsmfrontendPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
