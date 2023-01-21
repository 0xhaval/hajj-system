# Copyright (c) 2022, omar@havalx.com and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document
import frappe
class Rooms(Document):
	def after_insert(self):
		
		# create a new Item with Room info
		doc = frappe.new_doc('Item')
		doc.item_code = self.name
		doc.item_name = self.name
		doc.item_group = "All Item Groups"
		doc.stock_uom = "Nos"
		doc.stander_rate = self.cost
		doc.asset_category = "Rooms"
		doc.hotel_name = self.hotel
		doc.is_stock_item = False
		doc.insert()

		# set the Item Ref field in Room with created Item in above step
		self.item_ref = doc.name
		self.save()

		# Show alert about create Item
		frappe.msgprint(
			"Item is Created Successfully",
			alert=True,
			indicator="green"
		)