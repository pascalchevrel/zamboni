from django.conf import settings
from django.shortcuts import get_object_or_404

import commonware.log
import jingo

from mkt.ecosystem.tasks import refresh_mdn_cache
from mkt.site import messages

from .models import MdnCache
from .tasks import locales


log = commonware.log.getLogger('z.ecosystem')


def _refresh_mdn(request):
    if settings.MDN_LAZY_REFRESH and 'refresh' in request.GET:
        # If you can delay this, please teach me. I give up.
        refresh_mdn_cache()
        messages.success(request,
            'Pulling new content from MDN. Please check back in a few minutes.'
            ' Thanks for all your awesome work! Devs appreciate it!')


def landing(request):
    """Developer Hub landing page."""
    _refresh_mdn(request)

    videos = [
        {
            'name': 'airbnb',
            'path': 'FirefoxMarketplace-airbnb-BR-RC-SD1%20640'
        },
        {
            'name': 'evernote',
            'path': 'FirefoxMarketplace-Evernote_BR-RC-SD1%20640'
        },
        {
            'name': 'uken',
            'path': 'FirefoxMarketplace-uken-BR-RC-SD1%20640'
        },
        {
            'name': 'soundcloud',
            'path': 'FirefoxMarketplace-Soundcloud-BR-RC-SD1%20640'
        },
        {
            'name': 'box',
            'path': 'FirefoxMarketplace_box-BR-RC-SD1%20640'
        }
    ]
    return jingo.render(request, 'ecosystem/landing.html',
           {'videos': videos})


def support(request):
    """Landing page for support."""
    return jingo.render(request, 'ecosystem/support.html',
           {'page': 'support', 'category': 'build'})


def installation(request):
    """Landing page for installation."""
    return jingo.render(request, 'ecosystem/installation.html',
           {'page': 'installation', 'category': 'publish'})


def documentation(request, page=None):
    """Page template for all content that is extracted from MDN's API."""
    _refresh_mdn(request)

    if not page:
        page = 'html5'

    if request.LANG:
        locale = request.LANG.split('-')[0]
        if not locale in locales:
            locale = 'en-US'
    else:
        locale = 'en-US'

    data = get_object_or_404(MdnCache, name=page, locale=locale)

    if page in ('html5', 'manifests', 'manifest_faq', 'firefox_os',
                'tutorial_general', 'tutorial_weather', 'tutorial_serpent',
                'devtools', 'templates'):
        category = 'build'
    elif page in ('principles', 'purpose', 'patterns', 'references',
                  'custom_elements'):
        category = 'design'
    else:
        category = 'publish'

    ctx = {
        'page': page,
        'title': data.title,
        'content': data.content,
        'category': category
    }

    return jingo.render(request, 'ecosystem/documentation.html', ctx)
