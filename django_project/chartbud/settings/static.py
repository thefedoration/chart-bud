import os

# MAKE SURE THIS IS LINED UP WITH SETTINGS.BASE.PY:BASE_DIR
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.11/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    # other finders..
    'compressor.finders.CompressorFinder',
)
# STATICFILES_DIRS = [
#     os.path.join(BASE_DIR, "static"),
#     # '/var/www/static/',
# ]
# this busts the user cache when we change a file
STATICFILES_STORAGE = \
    'django.contrib.staticfiles.storage.CachedStaticFilesStorage'

# django compressor settings
COMPRESS_ENABLED = False
COMPRESS_OFFLINE = False

COMPRESS_CSS_FILTERS = [
    'compressor.filters.cssmin.CSSMinFilter'
]
COMPRESS_JS_FILTERS = [
    'compressor.filters.jsmin.JSMinFilter'
]

# so compressor also compiles scss files
COMPRESS_PRECOMPILERS = (
    ('text/x-scss', 'django_libsass.SassCompiler'),
)