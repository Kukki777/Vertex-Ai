
import { useMemo } from 'react'

function Preview({ tree }) {
  const srcDoc = useMemo(() => {
    let html = ""
    let css = ""
    let js = ""

    // Files ko recursively search karna
    const walk = (items = []) => {
      if (!Array.isArray(items)) {
        items = items ? [items] : []
      }

      for (const item of items) {
        const fileName = item.name?.toLowerCase() || ""

        if (fileName === "index.html") {
          html = item.content || ""
        }

        if (fileName.endsWith(".css")) {
          css += item.content || ""
        }

        if (fileName.endsWith(".js")) {
          js += item.content || ""
        }

        if (item.children?.length) {
          walk(item.children)
        }
      }
    }

    console.log("PREVIEW TREE:", tree);

    walk(tree)
    if (!html) {
      return `<!DOCTYPE html>
<html>
  <head>
    <title>Preview</title>
  </head>
  <body style="
    margin:0;
    background:#0a0a0c;
    color:#999;
    font-family:Arial, sans-serif;
    display:flex;
    justify-content:center;
    align-items:center;
    height:100vh;
  ">
    <div style="text-align:center;">
      <h3 style="margin:0 0 6px;">No index.html file found</h3>
      <p style="margin:0; font-size:13px; color:#666;">
        Please create an index.html file to preview your project.
      </p>
    </div>
  </body>
</html>`
    }

    if (css) {
      html = html.includes("</head>")
        ? html.replace("</head>", `<style>${css}</style></head>`)
        : `<style>${css}</style>${html}`
    }
    if (js) {
      html = html.includes("</body>")
        ? html.replace("</body>", `<script>${js}<\/script></body>`)
        : `${html}<script>${js}<\/script>`
    }

    return html
  }, [tree])

  return (
    <div className="flex h-full w-full flex-col bg-white">

      {/* Preview Header */}
      <div className="flex h-10 shrink-0 items-center justify-between bg-[#111113] px-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-zinc-300">Preview</span>
        </div>
      </div>

      {/* Preview Screen */}
      <iframe
        title="Preview"
        srcDoc={srcDoc}
        sandbox="allow-scripts allow-forms allow-modals"
        className="h-full w-full flex-1 border-0"
      />

    </div>
  )
}

export default Preview
