export default async function Resolver(root, { limit }) {
    const response = await fetch(`${process.env.POST_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            limit: limit,
            id: root.id
        })
    })
  
    const data = await response.json()
    
    return data
  }