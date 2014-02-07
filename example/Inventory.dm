domain-model inventory {
	node-mongo-options {
		model-path "models/"
	}
	type Address {
		String line1
		String line2
		String City
		String State
		String Zip
	}
	entity User {
		String id
		String name
		key ( id )
	}
	entity Payment {
		ref User purchaser
		ref Machine machine
		Numeric amount [ .01 .. ]
	}
	entity Page {
		Numeric id
		String subTypes
	}
	enum SodaItem {
		COKE = 'Coke' PEPSI = 'Pepsi' SPRITE = 'Sprite'
	}
	entity Selection {
		ref User purchaser
		ref Machine machine
		enum SodaItem item
	}
	type MachineId {
		String place
		String position
	}
	entity Machine {
		String id
		String name
		String description
		key ( id )
	}
	entity Inventory {
		String name
		String descirption
	}
	/*
   * A big Bad Item
   */
	entity Item {
		String id
		String name
		String description
		key ( id )
	}
	association inv2items {
		start Inventory inv!
		end Item items*
	}
}