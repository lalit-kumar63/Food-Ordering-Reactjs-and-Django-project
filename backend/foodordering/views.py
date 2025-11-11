from django.shortcuts import render
from rest_framework.decorators import api_view, parser_classes
from django.contrib.auth import authenticate
from rest_framework.response import Response
from .models import *
# Create your views here.

@api_view(['POST'])
def admin_login_api(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if user is not None and user.is_staff:
        return Response({'message': 'Login successful', username: username}, status=200)
    
    return Response({'message': 'Invalid credentials'}, status=401)


@api_view(['POST'])
def add_category(request):
    category_name = request.data.get('category_name')
   
    Category.objects.create(category_name=category_name)

    return Response({'message': 'Category Created Successfully'}, status=201)

from .serializers import CategorySerializer
@api_view(['GET'])
def list_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)

    return Response(serializer.data)


from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import FoodSerializer
@parser_classes([MultiPartParser, FormParser])
@api_view(['POST'])
def add_food_item(request):
    serializer = FoodSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Food item added Successfully'}, status=201)
    print(serializer.errors)

    return Response({"message":"Something went wrong"}, status=400)


from .serializers import FoodSerializer
@api_view(['GET'])
def list_foods(request):
    foods = Food.objects.all()
    serializer = FoodSerializer(foods, many=True)

    return Response(serializer.data)



@api_view(['GET'])
def food_search(request):
    query = request.GET.get('q','')
    foods = Food.objects.filter(item_name__icontains=query)
    serializer = FoodSerializer(foods, many=True)

    return Response(serializer.data)

import random
@api_view(['GET'])
def random_food(request):
    foods = list(Food.objects.all())
    random.shuffle(foods)
    limited_foods = foods[0:9]
    serializer = FoodSerializer(limited_foods, many=True)

    return Response(serializer.data)


from django.contrib.auth.hashers import make_password
@api_view(['POST'])
def register_user(request):
    first_name = request.data.get('firstname')
    last_name = request.data.get('lastname')
    mobile = request.data.get('mobilenumber')
    email = request.data.get('email')
    password = request.data.get('password')

    if User.objects.filter(email=email).exists() or User.objects.filter(mobile=mobile).exists():
        return Response({'message': 'Email or mobile already registered.'}, status=400)
    User.objects.create(first_name=first_name, last_name=last_name, mobile=mobile, email=email, password=make_password(password))
    return Response({"message":"User registered successfully."}, status=201)


from django.db.models import Q
from django.contrib.auth.hashers import check_password
@api_view(['POST'])
def login_user(request):
    identifier = request.data.get('emailcont')
    password = request.data.get('password')
    try:
        user = User.objects.get(Q(email=identifier) | Q(mobile=identifier))
        if check_password(password, user.password):
            return Response({'message': 'Login Successfully.',"userId":user.id, "userName":f"{user.first_name} {user.last_name}"}, status=200)
        else:
            return Response({"message":"Invalid Credentials."}, status=401)

    except:
        return Response({"message":"Invalid Credentials."}, status=401)
    

from django.shortcuts import get_object_or_404
@api_view(['GET'])
def food_detail(request, id):
    # food = Food.objects.get(id=id)
    food = get_object_or_404(Food,id=id)
    serializer = FoodSerializer(food)
    return Response(serializer.data)


@api_view(['POST'])
def add_to_cart(request):
    user_id = request.data.get('userId')
    food_id = request.data.get('foodId')
    try:
        user = User.objects.get(id=user_id)
        food = Food.objects.get(id=food_id)

        order, created = Order.objects.get_or_create(
            user = user,
            food = food,
            is_order_placed = False,
            # quantity = 1,
            defaults= {'quantity':1}
        )

        if not created:
            order.quantity += 1
            order.save()    
        return Response({'message': 'Food item added to cart Successfully.'}, status=200)


    except:
        return Response({"message":"Something went wrong."}, status=404)
    

from .serializers import CartOrderSerializer
@api_view(['GET'])
def get_cart_items(request, user_id):
    order = Order.objects.filter(user_id=user_id, is_order_placed = False).select_related('food')
    serializer = CartOrderSerializer(order,many=True)
    return Response(serializer.data)



@api_view(['PUT'])
def update_cart_quantity(request):
    order_id = request.data.get('orderId')
    quantity = request.data.get('quantity')
    try:
        order = Order.objects.get(id=order_id, is_order_placed=False)
        order.quantity=quantity
        order.save()
    
        return Response({'message': 'Quantity updated Successfully.'}, status=200)


    except:
        return Response({"message":"Something went wrong."}, status=404)
    


@api_view(['DELETE'])
def delete_cart_item(request, order_id):
    # order_id = request.data.get('order_id')
    
    try:
        order = Order.objects.get(id=order_id, is_order_placed=False)
        order.delete()
    
        return Response({'message': 'Item deleted Successfully from cart.'}, status=200)


    except:
        return Response({"message":"Something went wrong."}, status=404)
    
def make_unique_order_number():
    while True:
        num = str(random.randint(100000000, 999999999))
        if not OrderAddress.objects.filter(order_number = num).exists():
            return num

@api_view(['POST'])
def place_order(request):
    user_id = request.data.get('userId')
    address = request.data.get('address')
    payment_mode = request.data.get('paymentMode')
    card_number = request.data.get('cardNumber')
    expiry = request.data.get('expiry')
    cvv = request.data.get('cvv')
    try:
        order = Order.objects.filter(user_id=user_id, is_order_placed=False)
        
        order_number = make_unique_order_number()

        order.update(order_number=order_number, is_order_placed=True)

        OrderAddress.objects.create(
            user_id = user_id,
            order_number = order_number,
            address = address
        )

        PaymentDetail.objects.create(
            user_id = user_id,
            order_number = order_number,
            payment_mode = payment_mode,
            card_number = card_number if payment_mode == 'online' else None,
            expiry_date = expiry if payment_mode == 'online' else None,
            cvv = cvv if payment_mode == 'online' else None,

        )
        return Response({'message': f'Order placed Successfully! Order No: {order_number}.'}, status=201)


    except:
        return Response({"message":"Something went wrong."}, status=404)
    



from .serializers import MyOrdersListSerializer
@api_view(['GET'])
def user_orders(request, user_id):
    orders = OrderAddress.objects.filter(user_id=user_id).order_by('-id')
    serializer = MyOrdersListSerializer(orders,many=True)
    return Response(serializer.data)


from .serializers import OrderSerializer
@api_view(['GET'])
def order_by_order_number(request, order_number):
    order = Order.objects.filter(order_number=order_number, is_order_placed=True).select_related('food')
    serializer = OrderSerializer(order,many=True)
    return Response(serializer.data)


from .serializers import OrderAddressSerializer
@api_view(['GET'])
def get_order_address(request, order_number):
    address = OrderAddress.objects.get(order_number=order_number)
    serializer = OrderAddressSerializer(address)
    return Response(serializer.data)


from django.shortcuts import render
def get_invoice(request, order_number):
    orders = Order.objects.filter(order_number=order_number, is_order_placed=True).select_related('food')
    address = OrderAddress.objects.get(order_number=order_number)

    grand_total = 0
    order_data = []
    for order in orders:
        total_price = order.food.item_price * order.quantity
        grand_total += total_price
        order_data.append({
            'food': order.food,
            'quantity': order.quantity,
            'total_price': total_price
        })

    return render(request, 'invoice.html', {
        'order_number' : order_number,
        'address' : address,
        'grand_total' : grand_total,
        'orders' :order_data,
    })

from .serializers import UserSerializer
@api_view(['GET'])
def get_user_profile(request, user_id):
    user = User.objects.get(id=user_id)
    serializer = UserSerializer(user)
    return Response(serializer.data)



@api_view(['PUT'])
def update_user_profile(request, user_id):
    user = User.objects.get(id=user_id)
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'message':'Profile Updated Successfully!'}, status=200)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def change_password(request, user_id):
    user = User.objects.get(id=user_id)
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')

    if not check_password(current_password, user.password):
        return Response({"message":"Current password is incorrect."}, status=400)
    user.password = make_password(new_password)
    user.save()
    return Response({'message':'Password changed Successfully!'}, status=200)



from .serializers import OrderSummarySerializer
@api_view(['GET'])
def orders_not_confirmed(request):
    orders = OrderAddress.objects.filter(order_final_status__isnull =True).order_by('-order_time')
    serializer = OrderSummarySerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def orders_confirmed(request):
    orders = OrderAddress.objects.filter(order_final_status = "Order Confirmed").order_by('-order_time')
    serializer = OrderSummarySerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def food_being_prepared(request):
    orders = OrderAddress.objects.filter(order_final_status = "Food being Prepared").order_by('-order_time')
    serializer = OrderSummarySerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def food_pickup(request):
    orders = OrderAddress.objects.filter(order_final_status = "Food Pickup").order_by('-order_time')
    serializer = OrderSummarySerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def food_delivered(request):
    orders = OrderAddress.objects.filter(order_final_status = "Food Delivered").order_by('-order_time')
    serializer = OrderSummarySerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def order_cancelled(request):
    orders = OrderAddress.objects.filter(order_final_status = "Order Cancelled").order_by('-order_time')
    serializer = OrderSummarySerializer(orders, many=True)
    return Response(serializer.data)     

@api_view(['GET'])
def all_orders(request):
    orders = OrderAddress.objects.all().order_by('-order_time')
    serializer = OrderSummarySerializer(orders, many=True)
    return Response(serializer.data)



@api_view(['POST'])
def order_between_dates(request):
    from_date = request.data.get('from_date')
    to_date = request.data.get('to_date')
    status = request.data.get('status')
    orders = OrderAddress.objects.filter(order_time__date__range=[from_date,to_date])

    if status == 'not_confirmed':
        orders = orders.filter(order_final_status__isnull =True)
    elif status != 'all':
        orders = orders.filter(order_final_status =status)
    

    serializer = OrderSummarySerializer(orders.order_by('-order_time'), many=True)
    return Response(serializer.data)

from .serializers import OrderDetailSerializer, OrderedFoodSerializer, FoodTrackingSerializer
@api_view(['GET'])
def view_order_detail(request, order_number):
    
    try:
        order_address = OrderAddress.objects.select_related('user').get(order_number=order_number)
        ordered_food = Order.objects.filter(order_number=order_number).select_related('food')
        tracking = FoodTracking.objects.filter(order__order_number=order_number)
    except:
        return Response({'error':'Something went wrong'}, status=404)
    
    return Response({
        'order': OrderDetailSerializer(order_address).data,
        'foods': OrderedFoodSerializer(ordered_food, many=True).data,
        'tracking': FoodTrackingSerializer(tracking, many=True).data,

    })




@api_view(['POST'])
def update_order_status(request):
    order_number = request.data.get('order_number')
    new_status = request.data.get('status')
    remark = request.data.get('remark')
    
    try:
        address = OrderAddress.objects.get(order_number=order_number)
        order = Order.objects.filter(order_number=order_number).first()
        if not order:
            return Response({'error':'Order not found'}, status=404)
        FoodTracking.objects.create(
            order = order,
            status = new_status,
            remark = remark,
            order_cancelled_by_user = False,
        )
        address.order_final_status = new_status
        address.save()
        return Response({'message':'Order status updated successfully'}, status=200)
    except OrderAddress.DoesNotExist:
        return Response({'error':'Invalid order number'}, status=400)


@api_view(['GET'])
def search_orders(request):
    query = request.GET.get('q','')
    if query:
        orders = OrderAddress.objects.filter(order_number__icontains=query).order_by('-order_time')
    else:
        orders = []
    serializer = OrderSummarySerializer(orders, many=True)

    return Response(serializer.data)



@api_view(['GET', 'PUT', 'DELETE'])
def edit_delete_category(request, id):
    try:
        category = Category.objects.get(id=id)
    except Category.DoesNotExist:
        return Response({'error':'Category not found'}, status=404)
   
    if request.method == 'GET':
        serializer = CategorySerializer(category)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = CategorySerializer(category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Category Updated Successfully'}, status=200)
        
        return Response({'message': 'Something went wrong'}, status=400)
    elif request.method == 'DELETE':
        category.delete()
        return Response({'message': 'Category Deleted Successfully'}, status=200)




@api_view(['DELETE'])
def delete_food(request, id):
    try:
        food = Food.objects.get(id=id)
        food.delete()
        return Response({'message': 'Food Deleted Successfully'}, status=200)
    except Food.DoesNotExist:
        return Response({'error':'Food Item not found'}, status=404)
   

@api_view(['GET', 'PUT'])
@parser_classes([MultiPartParser, FormParser])
def edit_food(request, id):
    try:
        food = Food.objects.get(id=id)
    except Food.DoesNotExist:
        return Response({'error':'Food Item not found'}, status=404)
   
    if request.method == 'GET':
        serializer = FoodSerializer(food)
        return Response(serializer.data)
    elif request.method == 'PUT':
        data = request.data.copy()

        if 'image' not in request.FILES:
            data['image'] = food.image

        if 'is_available' in data:
            data['is_available'] = data['is_available'].lower() =='true'
        
        serializer = FoodSerializer(food, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Food Item Updated Successfully'}, status=200)
        
        return Response({'message': 'Something went wrong'}, status=400)
   





# api for edit and add food item

# @parser_classes([MultiPartParser, FormParser])
# @api_view(['POST'])
# def edit_food_item(request, id):
#     print(request.data)
#     # serializer = FoodSerializer(id,data=request.data)
#     obj = Food.objects.get(id=id)
#     serializer = FoodSerializer(obj, data=request.data, partial=True)

#     if serializer.is_valid():
#         serializer.save()
#         return Response({'message': 'Food edit added Successfully'}, status=200)
#     print(serializer.errors)

#     return Response({"message":"Something went wrong"}, status=400)

# @parser_classes([MultiPartParser, FormParser])
# @api_view(['GET'])
# def get_food_item(request, id):
#     try:
#         food = Food.objects.get(id=id)
#         serializer = FoodSerializer(food)
#         return Response(serializer.data)
#     except Food.DoesNotExist:
#         return Response({'error':'Food Item not found'}, status=404)
   



@api_view(['GET'])
def list_users(request):
    users = User.objects.all().order_by('-id')
    serializer = UserSerializer(users, many=True)

    return Response(serializer.data)


@api_view(['DELETE'])
def delete_user(request, id):
    try:
        user = User.objects.get(id=id)
        user.delete()
        return Response({'message': 'User Deleted Successfully'}, status=200)
    except Food.DoesNotExist:
        return Response({'error':'User Item not found'}, status=404)
   

from django.utils.timezone import now, timedelta, make_aware
from django.db.models import Sum, F, DateField
from datetime import datetime
@api_view(['GET'])
def dashboard_metrics(request):
    today = now().date()
    start_week = today - timedelta(days=today.weekday()) 
    start_month = today.replace(day=1)
    start_year = today.replace(month=1, day=1)
    
    def get_sales_total(start_date):
        aware_start = make_aware(datetime.combine(start_date, datetime.min.time()))
        paid_orders = PaymentDetail.objects.filter(payment_date__gte=aware_start).values_list('order_number', flat=True)
        # paid_orders = PaymentDetail.objects.filter(payment_date__gte=start_date).values_list('order_number', flat=True)
        total = (Order.objects.filter(
            order_number__in=paid_orders)
            .annotate(total_price=F('food__item_price') * F('quantity'))
            .aggregate(sale_amount=Sum('total_price'))['sale_amount'] or 0.0
        )
        return round(total, 2)
    data = {
        'total_orders': OrderAddress.objects.count(),
        'new_orders': OrderAddress.objects.filter(order_final_status__isnull=True).count(),
        'confirmed_orders': OrderAddress.objects.filter(order_final_status="Order Confirmed").count(),
        'food_preparing': OrderAddress.objects.filter(order_final_status="Food being Prepared").count(),
        'food_pickup': OrderAddress.objects.filter(order_final_status="Food Pickup").count(),
        'food_delivered': OrderAddress.objects.filter(order_final_status="Food Delivered").count(),
        'cancelled_orders': OrderAddress.objects.filter(order_final_status="Order Cancelled").count(),
        'total_users': User.objects.count(),
        'total_categories': Category.objects.count(),
        'total_reviews': Review.objects.count(),
        'total_wishlists': Wishlist.objects.count(),
        'total_foods': Food.objects.count(),
        'today_sales': get_sales_total(today),
        'week_sales': get_sales_total(start_week),
        'month_sales': get_sales_total(start_month),
        'year_sales': get_sales_total(start_year),

    }

    return Response(data)


from django.db.models import Sum, F, DecimalField
from decimal import Decimal
from collections import defaultdict
from django.db.models.functions import TruncMonth, Coalesce, TruncWeek

@api_view(['GET'])
def monthly_sales_summary(request):
    
    #step 1=> total = sum(quantity * price)
    
    orders = (
        Order.objects
                    .filter(is_order_placed=True)
                    .values('order_number')
                    .annotate
                        (total_price=Coalesce(Sum(F('food__item_price') * F('quantity'), 
                        output_field=DecimalField(max_digits=12, decimal_places=2)),Decimal('0.00'))
                        )
    )
                          
        
    
    # step 2 =>
    order_price_map={
        o['order_number']: o['total_price'] for o in orders
    }

    # step 3 => month resolve
    addresses = (
        OrderAddress.objects
                    .filter(order_number__in=order_price_map.keys())
                    .annotate(month=TruncMonth('order_time'))
                    .values('month', 'order_number')                   
    )

    # step 4 => monthly sum
    month_totals = defaultdict(lambda: Decimal('0.00'))

    for addr in addresses:
        label = addr['month'].strftime('%b')
        order_number = addr['order_number']
        month_totals[label] += order_price_map.get(order_number, Decimal('0.00'))

    result = [{'month': m, 'sales': total} for m, total in month_totals.items()]
    return Response(result)



@api_view(['GET'])
def top_selling_foods(request):
    
    
    top_foods = (
        Order.objects
                    .filter(is_order_placed=True)
                    .values('food__item_name')
                    .annotate
                        (total_sold = Sum('quantity'))
                    .order_by('-total_sold')[:5]
    )
                          
    return Response(top_foods)


@api_view(['GET'])
def weekly_sales_summary(request):
    
    #step 1=> total = sum(quantity * price)
    
    orders = (
        Order.objects
                    .filter(is_order_placed=True)
                    .values('order_number')
                    .annotate
                        (total_price=Coalesce(Sum(F('food__item_price') * F('quantity'), 
                        output_field=DecimalField(max_digits=12, decimal_places=2)),Decimal('0.00'))
                        )
    )
                          
        
    
    # step 2 =>
    order_price_map={
        o['order_number']: o['total_price'] for o in orders
    }

    # step 3 => month resolve
    addresses = (
        OrderAddress.objects
                    .filter(order_number__in=order_price_map.keys())
                    .annotate(week=TruncWeek('order_time'))
                    .values('week', 'order_number')                   
    )

    # step 4 => monthly sum
    weekly_totals = defaultdict(lambda: Decimal('0.00'))

    for addr in addresses:
        label = addr['week'].strftime('Week %W')
        order_number = addr['order_number']
        weekly_totals[label] += order_price_map.get(order_number, Decimal('0.00'))

    result = [{'week': w, 'sales': total} for w, total in weekly_totals.items()]
    return Response(result)



from django.db.models import Count
@api_view(['GET'])
def weekly_user_registrations(request):
    
    data = (
        User.objects
        .annotate(week=TruncWeek('reg_date'))
        .values('week')
        .annotate(new_users = Count('id'))
        .order_by('week')              
    )


    result = [{'week': entry["week"].strftime('Week %W'), 'new_users': entry["new_users"]} for entry in data]
    return Response(result)




@api_view(['POST'])
def add_to_wishlist(request):
    user_id = request.data.get('user_id')
    food_id = request.data.get('food_id')


   
    obj, created = Wishlist.objects.get_or_create(user_id=user_id, food_id=food_id)
    if created:
        return Response({'message': 'Added to Wishlist'}, status=201)
    else:
        # obj.delete()
        return Response({'message': 'Already in Wishlist'}, status=400)



@api_view(['POST'])
def remove_from_wishlist(request):
    user_id = request.data.get('user_id')
    food_id = request.data.get('food_id')

    try:
        obj = Wishlist.objects.get(user_id=user_id, food_id=food_id)
        obj.delete()
        return Response({'message': 'Removed from Wishlist'}, status=200)
    except Wishlist.DoesNotExist:
        return Response({'message': 'Item not found in Wishlist'}, status=404)

from .serializers import WishlistSerializer
@api_view(['GET'])
def get_from_wishlist(request, user_id):
    wishlist_items = Wishlist.objects.filter(user_id=user_id)
    serializer = WishlistSerializer(wishlist_items, many=True)
    return Response(serializer.data)
        

from  .serializers import FoodTrackingSerializer
@api_view(['GET'])
def track_order(request, order_number):

    sample_order = Order.objects.filter(order_number=order_number, is_order_placed=True).first()
    if not sample_order:
        return Response({'message':'Order not Found or not placed yet.'}, status=404)
    tracking_entries = FoodTracking.objects.filter(order=sample_order)
    serializer = FoodTrackingSerializer(tracking_entries, many=True)
    return Response(serializer.data)
        
@api_view(['POST'])
def cancel_order(request, order_number):
    sample_order = Order.objects.filter(order_number=order_number, is_order_placed=True).first()
    if not sample_order:
        return Response({'message': 'Order not Found or not placed yet.'}, status=404)
    
    
    # ✅ Read remark from request body (sent by frontend)
    remark = request.data.get('remark')

    FoodTracking.objects.create(
        order=sample_order,
        status='Order Cancelled',
        remark=remark,
        order_cancelled_by_user=True,
    )

    order_address = OrderAddress.objects.get(order_number=order_number)
    order_address.order_final_status = 'Order Cancelled'
    order_address.save()

    return Response({'message': 'Order cancelled successfully.'}, status=200)
