/**
 * Carlton Quadtree
 *  - A Quad Tree implementation in ESNext
 *  - Alistair MacDonald (f1lt3r)
 *  - MIT License
 *
 *  Demos: http://f1lt3r.github.io/carlton-quadtree
 *
 *  Example:
 *
 *	 	const myLeaf = new Leaf({
 *	 		bounds: {
 *	 			top: 0,
 *	 			right: 0,
 *	 			bottom: 0,
 *	 			left: 0
 *	 		}
 *	 	})
 *
 *	 	myLeaf.addItem({
 *	 		x:0, y:0, val: 123
 *	 	})
 *
 *	 	console.log(myLeaf.getItems())
 */

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

class Item {
	constructor(item, leaf) {
		itemCount += 1

		this.uid = itemCount
		this.index = leaf.items.push(item) - 1
		item.items = leaf.items
		item.leaf = leaf

		item.remove = () => {
			leaf.items.splice(this.index, 1)
			leaf.parent.collapse()
		}

		return item
	}
}

class Leaf {
	constructor(props) {
		this.valid = validLeaf(props)

		if (!this.valid) {
			return
		}

		leafCount += 1

		this.bounds = props.bounds
		this.depth = props.depth + 1 || 0
		this.uid = leafCount
		this.leaves = []
		this.items = []
		this.parent = props.parent || {root: true}
	}

	getItems() {
		if (this.items.length > 0) {
			return this.items
		}

		if (this.leaves.length > 0) {
			return this.leaves[0].getItems()
				.concat(
					this.leaves[1].getItems(),
					this.leaves[2].getItems(),
					this.leaves[3].getItems())
		}

		return []
	}

	getUnEmptyLeaves() {
		if (this.items.length > 0) {
			return [this]
		}

		if (this.leaves.length > 0) {
			return this.leaves[0].getUnEmptyLeaves()
				.concat(
					this.leaves[1].getUnEmptyLeaves(),
					this.leaves[2].getUnEmptyLeaves(),
					this.leaves[3].getUnEmptyLeaves())
		}

		return []
	}

	addItem(item) {
		if (!validItem(item)) {
			return {
				valid: false
			}
		}

		if (this.leaves.length > 0) {
			return place(item, this.leaves)
		}

		if (this.items.length < 4) {
			return new Item(item, this)
		}

		if (this.items.length === 4) {
			split(this)
			shuffle(this.items, this.leaves)

			this.items = []
			return place(item, this.leaves)
		}
	}

	collapse() {
		const subitems = this.getItems()
		this.leaves = []

		for (let i = 0, l = subitems.length; i < l; i++) {
			this.addItem(subitems[i])
		}
	}
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
		new Leaf({
			bounds: subBoundsTopLeft,
			depth: leaf.depth, parent: leaf
		}),

		new Leaf({
			bounds: subBoundsTopRight,
			depth: leaf.depth, parent: leaf
		}),

		new Leaf({
			bounds: subBoundsBottomRight,
			depth: leaf.depth, parent: leaf
		}),

		new Leaf({
			bounds: subBoundsBottomLeft,
			depth: leaf.depth, parent: leaf
		})
	)
}

// Constructor export depends on environment
if (typeof module === 'undefined') {
	window.Leaf = Leaf
} else {
	module.exports = Leaf
}
