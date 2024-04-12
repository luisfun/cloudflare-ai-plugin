export const mdTranslator = async (translator: (text: string) => Promise<string | undefined>, text: string) =>
  (
    await Promise.all(
      text.split('```').map(async (segment, i) => {
        // this is code block
        if (i % 2 === 1) return segment
        // not code block
        return (
          await Promise.all(
            segment.split('\n').map(async para => {
              // Bulleted List
              if (para.startsWith('- ')) return '- ' + (await translator(para.slice(2)))
              // Numbered List
              const numPrefix = para.match(/^(\d+\.\s)/)?.[0]
              if (numPrefix) return numPrefix + (await translator(para.slice(numPrefix.length)))
              // Normal Paragraph
              return translator(para)
            }),
          )
        ).join('\n')
      }),
    )
  ).join('```')
