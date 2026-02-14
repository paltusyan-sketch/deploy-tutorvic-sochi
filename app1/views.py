from django.shortcuts import render
from .models import Subjects

# Create your views here.

def format_price(price):
    price = str(price)                                                      # Приводим в удобный вид.
    price = price.replace(" ","")
    price = price.replace(",","")
    price = price.replace(".","")
    price = price.replace("₽","")

    if len(price) > 3:
        number_of_commas = len(price) // 3                                  # Определяем количество запятых.  
        if len(price) % 3 == 0:
            number_of_commas -= 1

        positions_of_commas = [-4]
        while len(positions_of_commas) < number_of_commas:                  # Определяем позиции запятых.
            positions_of_commas += [positions_of_commas[-1] - 4]
            # print(positions_of_commas)

        while len(positions_of_commas) != 0:                                # Ставим запятые на нужные позиции.
            price = price[0:positions_of_commas[0]+1] + "," + price[positions_of_commas[0]+1:]
            del positions_of_commas[0]
    # print("₽" + price)
    return "₽" + price



def calculate_wholesale_price(retail_price, package_size, discount_percent):
    opt_price = (retail_price * package_size) * (100 - discount_percent) / 100
    opt_price = int(opt_price)
    # print(opt_price)
    return opt_price



def index_page(request):
    math_name = Subjects.objects.get(id=3).discipline
    physics_name = Subjects.objects.get(id=2).discipline
    info_name = Subjects.objects.get(id=1).discipline


    math_cost = Subjects.objects.get(id=3).cost
    physics_cost = Subjects.objects.get(id=2).cost
    info_cost = Subjects.objects.get(id=1).cost

    math_package_size = Subjects.objects.get(id=3).package_size
    physics_package_size = Subjects.objects.get(id=2).package_size
    info_package_size = Subjects.objects.get(id=1).package_size

    math_discount_percent = Subjects.objects.get(id=3).discount_percent
    physics_discount_percent = Subjects.objects.get(id=2).discount_percent
    info_discount_percent = Subjects.objects.get(id=1).discount_percent


    context = {
        "math_name" : math_name,
        "physics_name" : physics_name,
        "info_name" : info_name,

        "math_cost" : format_price(math_cost),
        "physics_cost" : format_price(physics_cost),
        "info_cost" : format_price(info_cost),

        "math_opt_cost" : format_price(calculate_wholesale_price(math_cost, math_package_size, math_discount_percent)),
        "physics_opt_cost" : format_price(calculate_wholesale_price(physics_cost, physics_package_size, physics_discount_percent)),
        "info_opt_cost" : format_price(calculate_wholesale_price(info_cost, info_package_size, info_discount_percent)),

        "math_package_size" : math_package_size,
        "physics_package_size" : physics_package_size,
        "info_package_size" : info_package_size,

        "math_opt_cost_without_discount" : format_price(math_package_size * math_cost),
        "physics_opt_cost_without_discount" : format_price(physics_package_size * physics_cost),
        "info_opt_cost_without_discount" : format_price(info_package_size * info_cost),

        "math_discount_percent" : math_discount_percent,
        "physics_discount_percent" : physics_discount_percent,
        "info_discount_percent" : info_discount_percent,
    }
    return render(request, "index.html", context)


def redirect_page(request):
    return render(request, "redirect.html")
