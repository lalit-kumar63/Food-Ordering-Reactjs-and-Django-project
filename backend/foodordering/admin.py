from django.contrib import admin

# Register your models here.
from .models import *

admin.site.register(User)
admin.site.register(Category)
admin.site.register(Food)
admin.site.register(Order)
admin.site.register(OrderAddress)
admin.site.register(FoodTracking)
admin.site.register(PaymentDetail)
admin.site.register(Review)
admin.site.register(Wishlist)