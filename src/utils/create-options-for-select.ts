 const CreateOptionsForSelect = (payload?: any[], from?: string) => {
    let output: any[] = []
    if (payload && payload.length && from === 'name') {
        payload.map(department => {
            const data = { label: department.name, value: department.id }
            output.push(data)
        })
    }

    if (payload && payload.length && from === 'code-name') {
        payload.map(indicator => {
            const data = { label: `${indicator.formatted_code} - ${indicator.name}`, value: indicator.id }
            output.push(data)
        })
    }

    if (payload && payload.length && from === 'full-name-department') {
        payload.map(user => {
            const data = { label: `${user.full_name} - ${user.department}`, value: user.id }
            output.push(data)
        })
    }

    if (payload && payload.length && from === 'full-name') {
        payload.map(user => {
            const data = { label: `${user.full_name}`, value: user.id }
            output.push(data)
        })
    }

    return output
}
export default CreateOptionsForSelect