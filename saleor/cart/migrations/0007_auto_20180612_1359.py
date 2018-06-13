# Generated by Django 2.0.3 on 2018-06-12 06:59

from django.db import migrations
import django_prices.models


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0006_auto_20180221_0825'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cart',
            name='total',
            field=django_prices.models.MoneyField(currency='Rp.', decimal_places=2, default=0, max_digits=12),
        ),
    ]