# Copyright (c) 2022, omar@havalx.com and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document
import frappe
from frappe import utils
class Booking(Document):

	# Throw validation on check out date
	def before_save(self):
		if(self.check_out < self.check_in):
			frappe.throw("Please: Select valid Check Out Date :)")

	# change the status of booking (Check In)
	@frappe.whitelist()
	def start_check_in(self):
		for room in self.booked_room:
			doc = frappe.get_doc('Rooms', room.room_number)
			doc.status = 'Occupied'
			doc.save()
		self.status = "Check-In"
		self.save()


	@frappe.whitelist()
	def start_check_out(self):
		for room in self.booked_room:
			doc = frappe.get_doc('Rooms', room.room_number)
			doc.status = 'Free'
			doc.save()
		self.status = "Check-Out"
		self.exact_check_out = utils.today()
		self.save()

	@frappe.whitelist()
	def set_invoice_ref(self, invoice_ref):
		self.invoice_ref = invoice_ref
		self.save()