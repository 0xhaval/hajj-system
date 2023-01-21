// Copyright (c) 2023, omar@havalx.com and contributors
// For license information, please see license.txt

frappe.ui.form.on('Trip', {
	// Filter Trip manager field
	setup: function(frm) {
        frm.set_query("trip_manager", function() {
    		return {
    			filters: [
					["Customer", "trip_manager", "=", true]
				]
    		}
    	});
	}
});
