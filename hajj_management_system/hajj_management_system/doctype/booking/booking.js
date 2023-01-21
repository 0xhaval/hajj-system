// Copyright (c) 2022, omar@havalx.com and contributors
// For license information, please see license.txt

frappe.ui.form.on('Booking', {

	refresh:function(frm){
		// add Check In button after save the booking
		if(frm.doc.docstatus == 1 && frm.doc.status == "Pending"){
			frm.add_custom_button("Check-In", function() {
				frappe.confirm(
					'Are you sure start Check-In ?',
					function(){
						frappe.call({
							method: "start_check_in", 
							doc: frm.doc,
							callback: function(r) {
								// create Sales Invoice when click Check In button
								frappe.db.insert({
									'doctype': 'Sales Invoice',
									'customer': frm.doc.guest,
									'selling_price_list': 'Standard Selling',
									'items': frm.doc.booked_room.map((room) => {
										   return {
												'item_code' : room.room_number,
												'item_name' : room.room_number,
												'rate' : room.cost,
												'qty':frm.doc.number_of_days
											};
										})
								}).then(doc => {
									frappe.call({
										method: 'set_invoice_ref', // set the invoice_ref field
										doc: frm.doc,
										args: {
											'invoice_ref': doc.name
										},
										callback: function(r) {
											
										}
									})
								});
							}
						});
						frappe.show_alert("The Check Out is Complete Successfully")
					},
					function(){
						frappe.show_alert('Thanks for continue here!')
					}
				)
			}).addClass("btn-primary");
		}

		if(frm.doc.docstatus == 1 && frm.doc.status == "Check-In"){
			frm.add_custom_button("Check-Out", function() {
				frappe.confirm(
					'Are you sure to Check-Out ?',
					function(){
						frappe.call({
							method: "start_check_out", 
							doc: frm.doc,
							callback: function(r) {
							}
						});
						frappe.show_alert("The Check Out is Complete Successfully")
					},
					function(){
						frappe.show_alert('Thanks for continue here!')
					}
				)
			}).addClass("btn-danger");
		}
	},

	// Validation on Check-Out date
	'check_out': function(frm) {
		let ch_in = frm.doc.check_in
		let ch_out = frm.doc.check_out
		
		// validate if Check Out less than Check In
		if(ch_in > ch_out){
		    frappe.msgprint("Please: Select valid Check Out Date :)");
		}else{
		    let diff = frappe.datetime.get_day_diff( ch_out , ch_in);
		    frm.set_value("number_of_days", diff)
		}
	},

	// Calculate Total amount (Total Room cost * Number of Days)
	validate:function(frm){
		var total_amount_each = 0
		var total_amount = 0
		$.each(frm.doc.booked_room, function(idx, row){
			total_amount_each = frm.doc.number_of_days * row.cost
			total_amount = total_amount + total_amount_each
		})
		frm.set_value("total_amount", total_amount)
	},

	// Filter Booked Room child table, with Free Rooms
	setup: function(frm) {
        frm.set_query("room_number", "booked_room", function() {
    		return {
    			filters: {
					"status": ["=", "Free"],
					"territory": ["=" ,frm.doc.territory],
					"hotel": ["=", frm.doc.hotel]
				}
    		}
    	});
	}
});
