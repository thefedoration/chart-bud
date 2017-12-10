# from __future__ import absolute_import
# 
# import itertools
# import operator
# 
# import django_filters
# from django.db.models import Q
# 
# from comparison.models import ComparisonType
# 
# 
# class ComparisonTypeFilter(django_filters.FilterSet):
# 
#     class Meta:
#         model = ComparisonType
#         fields = [
#             'category',
#             'is_point',
#             'is_baseline',
#         ]
# 
#     category = django_filters.MethodFilter(action='filter_category')
#     is_point = django_filters.MethodFilter(action='filter_is_point')
#     is_baseline = django_filters.MethodFilter(action='filter_is_baseline')
#     # TODO add filter by name -Colin
# 
#     def _comma_separated_or_filter(self, queryset, value, name):
#         values = value.split(',') or ()
# 
#         if not values:
#             return queryset
# 
#         q = Q()
#         for v in values:
#             q |= Q(**{name: v})
# 
#         return queryset.filter(q).distinct()
# 
#     def filter_category(self, queryset, value):
#         name = 'category__name'
#         return self._comma_separated_or_filter(
#             queryset, value, name).distinct()
# 
#     def filter_is_point(self, queryset, value):
#         bool = {'true': True, 'false': False}
#         return queryset.filter(is_point=bool[value]).distinct()
# 
#     def filter_is_baseline(self, queryset, value):
#         bool = {'true': True, 'false': False}
#         return queryset.filter(is_baseline=bool[value]).distinct()
