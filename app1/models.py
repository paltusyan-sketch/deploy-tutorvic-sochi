from django.db import models

# Create your models here.

class Subjects(models.Model):
    discipline = models.CharField(max_length=40)
    cost = models.IntegerField(max_length=40)
    package_size = models.IntegerField(max_length=40, default=10)
    discount_percent = models.IntegerField(max_length=40, verbose_name="Discount", help_text="Скидка %", null=True)
    def __str__(self):
        return f"{self.discipline}"