import json
from pathlib import Path
from django.core.management.base import BaseCommand
from djangoapp.models import CarMake, CarModel


class Command(BaseCommand):
    help = "Load the IBM car data without duplicating existing models"

    def handle(self, *args, **options):
        path = Path(__file__).resolve().parents[3] / "database/data/car_records.json"
        for car in json.loads(path.read_text())["cars"]:
            make, _ = CarMake.objects.get_or_create(name=car["make"])
            CarModel.objects.get_or_create(
                car_make=make, name=car["model"], year=car["year"],
                defaults={"car_type": car["bodyType"]})
        self.stdout.write(f"{CarMake.objects.count()} makes, {CarModel.objects.count()} models")
