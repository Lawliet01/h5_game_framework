export function bfs(node, func){
    const search = Array.isArray(node)?[...node]:[node]
    while (search.length) {
        const currNode = search.shift()
        func(currNode);
        if (Array.isArray(currNode.children)) {
			search.push(...currNode.children);
		}
    }
}