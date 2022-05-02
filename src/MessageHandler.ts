import messages from '../messages.json'

function getMessage(
	index: keyof typeof messages,
	language: 'pt-br' | 'en-us',
	keys?: { [key: string]: string | number }
) {
	const message = messages[index][language]

	return message.replaceAll(
		/\{\{|\}\}|\{([^}]+)\}/g,
		(m: string, name: string): string => {
			if (m === '{{') return '{'
      if (m === '}}') return '}'
      
			return keys?.[name].toString() ?? m
		}
	)
}

export = getMessage
