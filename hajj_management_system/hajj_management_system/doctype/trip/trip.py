# Copyright (c) 2023, omar@havalx.com and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Trip(Document):

	# Throw validation on From and To date
	def before_save(self):
		if(self.from_date > self.to_date):
			frappe.throw("Please: Can't be From date greater than To date :)")

		if(self.from_date == self.to_date):
			frappe.throw("Please: Can't be From date equal than To date :)")
