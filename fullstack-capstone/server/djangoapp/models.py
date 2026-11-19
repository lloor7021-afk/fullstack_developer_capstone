from django.conf import settings
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class CarMake(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class CarModel(models.Model):
    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE, related_name="models")
    name = models.CharField(max_length=100)
    car_type = models.CharField(max_length=30)
    year = models.IntegerField(validators=[MinValueValidator(2015), MaxValueValidator(2026)])

    class Meta:
        constraints = [models.UniqueConstraint(fields=["car_make", "name", "year"], name="unique_car_model")]

    def __str__(self):
        return f"{self.car_make} {self.name} ({self.year})"


class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    dealership = models.PositiveIntegerField()
    review = models.TextField(max_length=4000)
    purchase = models.BooleanField(default=False)
    purchase_date = models.DateField(null=True, blank=True)
    car_model = models.ForeignKey(CarModel, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at", "-id"]
