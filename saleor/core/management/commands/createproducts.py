from django.conf import settings
from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.db import connection
from ...utils.data import check_category,validate_images,redownload_images,custom_product_details


class Command(BaseCommand):
	help = 'Create Products from www.blibli.com'
	dir_json = r'saleor/static/json/products/'
	placeholders_dir = r'saleor/static/placeholders/'

	def handle(self, *args, **options):
		# for msg in redownload_images(self.dir_json,self.placeholders_dir):
		# 	self.stdout.write(msg)
		# for msg in check_category(self.dir_json):
		# 	self.stdout.write(msg)
		# for msg in validate_images(self.dir_json):
		# 	self.stdout.write(msg)
		for msg in custom_product_details():
			self.stdout.write(msg)