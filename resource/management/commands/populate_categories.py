# management/commands/populate_categories_and_subcategories.py

from django.core.management.base import BaseCommand
from resource.models import Category

class Command(BaseCommand):
    help = 'Populates the database with default book categories and subcategories'

    def handle(self, *args, **kwargs):
        # Define categories and their subcategories
        categories_and_subcategories = {
            "Fiction": ["Novels", "Short Stories", "Literary Fiction", "Historical Fiction", "Fantasy", "Science Fiction", "Mystery/Thriller"],
            "Non-Fiction": ["Biography/Autobiography", "Self-Help", "Travel", "True Crime", "Cooking/Food", "Health & Wellness", "Politics"],
            "Academic": ["Textbooks", "Reference Books", "Research Papers", "Journals"],
            "Children's Books": ["Picture Books", "Early Readers", "Chapter Books", "Young Adult"],
            "Comics & Graphic Novels": ["Manga", "Superhero Comics", "Independent Comics"],
            "Poetry": ["Classic Poetry", "Modern Poetry", "Anthologies"],
            "Drama/Plays": ["Classic Plays", "Contemporary Plays"],
            "Religion & Spirituality": ["Religious Texts", "Philosophy", "Spirituality"],
            "Science & Nature": ["Popular Science", "Environmental Science", "Astronomy", "Biology"],
            "Course Materials": {
                "School of Applied Natural Sciences": [
                    "Applied Biology",
                    "Applied Chemistry",
                    "Applied Geology",
                    "Applied Mathematics",
                    "Applied Physics",
                ],
                "School of Civil Engineering and Architecture": [
                    "Architecture",
                    "Civil Engineering",
                    "Construction Technology and Management",
                    "Urban Planning and Design",
                    "Geomatics Engineering",
                    "Water Resources Engineering",
                ],
                "School of Electrical Engineering and Computing": [
                    "Computer Science and Engineering",
                    "Electronics and Communication Engineering",
                    "Electrical Power and Control Engineering",
                ],
                "School of Mechanical, Chemical, and Materials Engineering": [
                    "Chemical Engineering",
                    "Materials Science and Engineering",
                    "Mechanical Design and Manufacturing Engineering",
                    "Mechanical Systems and Vehicle Engineering",
                    "Thermal and Aerospace Engineering",
                ],
            }
        }
        def create_category(categories_and_subcategories, parent=None):
            for category_name, subcategories in categories_and_subcategories.items():
                if parent:
                    category,_ = Category.objects.get_or_create(name=category_name, parent=parent)
                else:
                    category, _ = Category.objects.get_or_create(name=category_name)
                if type(subcategories) == dict:
                    create_category(subcategories, category)
                    return
                for subcategory_name in subcategories:
                    
                    Category.objects.get_or_create(name=subcategory_name, parent=category) # here

        create_category(categories_and_subcategories)

        self.stdout.write(self.style.SUCCESS('Successfully populated default categories and subcategories'))
