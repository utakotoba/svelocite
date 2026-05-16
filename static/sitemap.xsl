<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  exclude-result-prefixes="sitemap xhtml"
>
  <xsl:output method="html" encoding="UTF-8" indent="yes" />

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sitemap</title>
        <style>
          :root {
            color-scheme: light dark;
            --bg: #ffffff;
            --panel: #ffffff;
            --header: #f6f8fa;
            --text: #1f2328;
            --muted: #6e7781;
            --line: #d8dee4;
            --link: #4f46e5;
            --code-bg: #f6f8fa;
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --bg: #171717;
              --panel: #171717;
              --header: #262626;
              --text: #e5e5e5;
              --muted: #a3a3a3;
              --line: #373737;
              --link: #818cf8;
              --code-bg: #373737;
            }
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            background: var(--bg);
            color: var(--text);
            font-family:
              ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
              "Segoe UI", sans-serif;
            font-size: 14px;
            line-height: 1.35;
          }

          main {
            width: min(1280px, calc(100% - 24px));
            margin: 0 auto;
            padding: 24px 0;
          }

          header {
            display: flex;
            gap: 16px;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
          }

          h1 {
            margin: 0;
            font-size: 20px;
            font-weight: 650;
            letter-spacing: 0;
          }

          p {
            margin: 4px 0 0;
            color: var(--muted);
            font-size: 13px;
          }

          a {
            color: var(--link);
            text-decoration: none;
          }

          a:hover {
            text-decoration: underline;
          }

          .count {
            color: var(--muted);
            font-variant-numeric: tabular-nums;
            white-space: nowrap;
          }

          .table-wrap {
            overflow-x: auto;
            border: 1px solid var(--line);
            border-radius: 6px;
            background: var(--panel);
          }

          table {
            width: 100%;
            min-width: 940px;
            table-layout: fixed;
            border-collapse: collapse;
          }

          th,
          td {
            padding: 7px 10px;
            border-bottom: 1px solid var(--line);
            text-align: left;
            vertical-align: middle;
          }

          th {
            position: sticky;
            top: 0;
            z-index: 1;
            background: var(--header);
            color: var(--muted);
            font-size: 12px;
            font-weight: 650;
          }

          tr:last-child td {
            border-bottom: 0;
          }

          tr:hover td {
            background: var(--header);
          }

          .url-col {
            width: 40%;
          }

          .date-col {
            width: 21%;
          }

          .change-col {
            width: 13%;
          }

          .priority-col {
            width: 5%;
          }

          .alternates-col {
            width: 21%;
          }

          .truncate {
            display: block;
            overflow: hidden;
            max-width: 100%;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .meta {
            color: var(--muted);
            font-variant-numeric: tabular-nums;
            white-space: nowrap;
          }

          .priority {
            display: inline-block;
            min-width: 34px;
            padding: 1px 6px;
            border-radius: 4px;
            background: var(--code-bg);
            color: var(--text);
            font-family:
              ui-monospace, SFMono-Regular, SFMono-Regular, Consolas,
              "Liberation Mono", monospace;
            font-size: 12px;
            text-align: center;
          }

          .alternates {
            overflow: hidden;
            color: var(--muted);
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .alternates a {
            font-family:
              ui-monospace, SFMono-Regular, SFMono-Regular, Consolas,
              "Liberation Mono", monospace;
            font-size: 12px;
          }

          @media (max-width: 720px) {
            main {
              width: min(100% - 16px, 1280px);
              padding: 16px 0;
            }

            header {
              align-items: flex-start;
              flex-direction: column;
              gap: 6px;
            }
          }
        </style>
      </head>
      <body>
        <main>
          <header>
            <div>
              <h1>Sitemap</h1>
              <p>Public URLs and localized alternates.</p>
            </div>
            <div class="count">
              <xsl:value-of select="count(sitemap:urlset/sitemap:url)" />
              URLs
            </div>
          </header>

          <section class="table-wrap" aria-label="Sitemap URLs">
            <table>
              <thead>
                <tr>
                  <th class="url-col">URL</th>
                  <th class="date-col">Last Modified</th>
                  <th class="change-col">Change Frequency</th>
                  <th class="priority-col">Priority</th>
                  <th class="alternates-col">Alternates</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td>
                      <a class="truncate" href="{sitemap:loc}" title="{sitemap:loc}">
                        <xsl:value-of select="sitemap:loc" />
                      </a>
                    </td>
                    <td class="meta">
                      <span class="truncate">
                        <xsl:choose>
                          <xsl:when test="sitemap:lastmod">
                            <xsl:value-of select="sitemap:lastmod" />
                          </xsl:when>
                          <xsl:otherwise>-</xsl:otherwise>
                        </xsl:choose>
                      </span>
                    </td>
                    <td class="meta">
                      <xsl:choose>
                        <xsl:when test="sitemap:changefreq">
                          <xsl:value-of select="sitemap:changefreq" />
                        </xsl:when>
                        <xsl:otherwise>-</xsl:otherwise>
                      </xsl:choose>
                    </td>
                    <td>
                      <xsl:choose>
                        <xsl:when test="sitemap:priority">
                          <span class="priority">
                            <xsl:value-of select="sitemap:priority" />
                          </span>
                        </xsl:when>
                        <xsl:otherwise>
                          <span class="meta">-</span>
                        </xsl:otherwise>
                      </xsl:choose>
                    </td>
                    <td>
                      <div class="alternates">
                        <xsl:for-each select="xhtml:link">
                          <a href="{@href}" title="{@href}">
                            <xsl:value-of select="@hreflang" />
                          </a>
                          <xsl:if test="position() != last()">, </xsl:if>
                        </xsl:for-each>
                      </div>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </section>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
