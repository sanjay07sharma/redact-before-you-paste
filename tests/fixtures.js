/** Sample inputs. All names, companies, numbers and keys are invented. */

export const DEAL_EMAIL = `Hi Rajesh,

Follow-up for Sanjay Sharma, CFO at Acme Textiles Pvt Ltd. 40 users, ₹18L deal, 22% off. Zylo ERP quoted ₹15,00,000. Renewal 31 Dec 2026.
Call him on +91 98765 43210 or rajesh. Sharma@acmetextiles.example.
Ask Sanjayabout it.

Best regards,
SimonRiley`;

export const KITCHEN_SINK = `DB: https://acme-prod.odoo.com/web#action=123&model=account.move
Invoice INV/2026/0412 for €48,200.50 is unpaid. IBAN: BE68 5390 0754 7034, IFSC HDFC0001234
PAN ABCDE1234F, GSTIN 27ABCDE1234F1Z5, Aadhaar 2345 6789 0124
Card 4111 1111 1111 1111
api_key=sk_live_9f8e2c7a6b5d4e3f2a1b
password: "Hunter2!x"
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U
ghp_aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789
Server 10.0.12.45, MAC 00:1A:2B:3C:4D:5E
postgres://odoo:s3cret@db.internal:5432/acme
Account no 123456789012345
Mr. Anil Kapoor will join. Meeting on 2026-10-12.`;

/** Non-sensitive technical text that should stay readable. */
export const TRACEBACK = `Traceback (most recent call last):
  File "/home/odoo/src/odoo/odoo/http.py", line 2361, in __call__
    response = request._serve_db()
  File "/home/odoo/src/odoo/addons/account/models/account_move.py", line 4521, in action_post
    raise UserError(_("The entry %s (id %s) is already posted.", move.display_name, move.id))
Version: saas~18.2, module account, model account.move, res.partner, sale.order
See https://www.odoo.com/documentation/18.0/applications/finance/accounting.html
Thanks Team,
Support`;

/** Odoo traceback whose message carries a field name, view ids and a memory address. */
export const TRACEBACK_ERRORS = `Traceback (most recent call last):
  File "/odoo/odoo-server/odoo/fields.py", line 937, in __get__
    value = record.env.cache.get(record, self)
KeyError: <odoo.api.Environment object at 0x7f3c8153e320>

  File "/odoo/odoo-server/odoo/models.py", line 1381, in fields_view_get
    xarch, xfields = View.postprocess_and_fields(self._name, view_id, 'search')
ValueError: Le champ \`pos_config_id\` n'existe pas

Contexte de l'erreur :
Vue \`sale.order.search.inherit.quotation\`
[view_id: 647, xml_id: sale.sale_order_view_search_inherit_quotation, model: sale.order, parent_id: 646]`;
