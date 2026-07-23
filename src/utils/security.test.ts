import { escapeHtml } from './security';

describe('escapeHtml', () => {
  it('escapes markup and attribute delimiters', () => {
    expect(escapeHtml('<script>"x" & \'y\'</script>')).toBe(
      '&lt;script&gt;&quot;x&quot; &amp; &#039;y&#039;&lt;/script&gt;'
    );
  });
});
