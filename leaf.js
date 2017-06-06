let leafCount = 0
let itemCount = 0

const isInBounds = (item, bounds) => {
	if (item.x >= bounds.left &&
		item.x < bounds.right &&
		item.y >= bounds.top &&
		item.y < bounds.bottom) {
		return true
	}

	return false
}

const shuffle = (items, leaves) => {
	items.forEach(subitem => {
		leaves.forEach(subleaf => {
			if (isInBounds(subitem, subleaf.bounds)) {
				subleaf.addItem(subitem)

				return false
			}
		})
	})
}

const place = (item, leaves) => {
	let subleaf

	for (let i = 0; i < 4; i += 1) {
		subleaf = leaves[i]

		if (isInBounds(item, subleaf.bounds)) {
			return subleaf.addItem(item)
		}
	}
}

const validLeaf = props => {
	if (props === undefined) {
		return false
	}

	if (!props.bounds) {
		return false
	}

	if (Reflect.has(props, 'bounds')) {
		if (!Reflect.has(props.bounds, 'top') ||
			!Reflect.has(props.bounds, 'left') ||
			!Reflect.has(props.bounds, 'bottom') ||
			!Reflect.has(props.bounds, 'right')) {
			return false
		}
	}

	return true
}

const validItem = item => {
	if (item === undefined) {
		return false
	}

	if ((typeof item).toString() === 'object') {
		if (!Reflect.has(item, 'x') ||
			!Reflect.has(item, 'y') ||
			!Reflect.has(item, 'val')) {
			return false
		}
	}

	return true
}

const constructItem = (item, leaf) => {
	itemCount += 1

	item.uid = itemCount
	item.leaf = leaf
	item.index = leaf.items.push(item) - 1

	item.remove = () => {
		leaf.items.splice(leaf.index, 1)
		leaf.parent.collapse()
	}

	return item
}

const constructLeaf = props => {
	if (!validLeaf(props)) {
		return undefined
	}

	leafCount += 1

	const leaf = {
		bounds: props.bounds,
		depth: props.depth + 1 || 0,
		uid: leafCount,
		leaves: [],
		items: [],
		parent: props.parent || {root: true}
	}

	leaf.getItems = () => {
		if (leaf.items.length > 0) {
			return leaf.items
		}

		if (leaf.leaves.length > 0) {
			return leaf.leaves[0].getItems()
				.concat(
					leaf.leaves[1].getItems(),
					leaf.leaves[2].getItems(),
					leaf.leaves[3].getItems())
		}

		return []
	}

	leaf.getUnEmptyLeaves = () => {
		if (leaf.items.length > 0) {
			return [leaf]
		}

		if (leaf.leaves.length > 0) {
			return leaf.leaves[0].getUnEmptyLeaves()
				.concat(
					leaf.leaves[1].getUnEmptyLeaves(),
					leaf.leaves[2].getUnEmptyLeaves(),
					leaf.leaves[3].getUnEmptyLeaves())
		}

		return []
	}

	leaf.addItem = item => {
		if (!validItem(item)) {
			return undefined
		}

		if (leaf.leaves.length > 0) {
			return place(item, leaf.leaves)
		}

		if (leaf.items.length < 4) {
			return constructItem(item, leaf)
		}

		if (leaf.items.length === 4) {
			split(leaf)
			shuffle(leaf.items, leaf.leaves)

			leaf.items = []
			return place(item, leaf.leaves)
		}
	}

	leaf.collapse = () => {
		const subitems = leaf.getItems()
		leaf.leaves = []

		for (let i = 0, l = subitems.length; i < l; i++) {
			leaf.addItem(subitems[i])
		}
	}

	return leaf
}

const split = leaf => {
	const midX = leaf.bounds.left +
		((leaf.bounds.right - leaf.bounds.left) / 2)
	const midY = leaf.bounds.top +
		((leaf.bounds.bottom - leaf.bounds.top) / 2)

	const subBoundsTopLeft = {
		top: leaf.bounds.top,
		left: leaf.bounds.left,
		right: midX,
		bottom: midY
	}

	const subBoundsTopRight = {
		top: leaf.bounds.top,
		left: midX,
		right: leaf.bounds.right,
		bottom: midY
	}

	const subBoundsBottomRight = {
		top: midY,
		left: midX,
		right: leaf.bounds.right,
		bottom: leaf.bounds.bottom
	}

	const subBoundsBottomLeft = {
		top: midY,
		left: leaf.bounds.left,
		right: midX,
		bottom: leaf.bounds.bottom
	}

	leaf.leaves.push(
		constructLeaf({
			bounds: subBoundsTopLeft,
			depth: leaf.depth, parent: leaf
		}),

		constructLeaf({
			bounds: subBoundsTopRight,
			depth: leaf.depth, parent: leaf
		}),

		constructLeaf({
			bounds: subBoundsBottomRight,
			depth: leaf.depth, parent: leaf
		}),

		constructLeaf({
			bounds: subBoundsBottomLeft,
			depth: leaf.depth, parent: leaf
		})
	)
}

// Constructor export depends on environment
if (typeof module === 'undefined') {
	window.Leaf = constructLeaf
} else {
	module.exports = constructLeaf
}
