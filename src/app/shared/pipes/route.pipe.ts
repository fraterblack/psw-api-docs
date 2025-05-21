import { Pipe, PipeTransform } from '@angular/core';
import { replace, startsWith } from 'lodash';

import { ViewRoute } from './../../core/enums/view-route.enum';

@Pipe({
  name: 'route'
})
export class RoutePipe implements PipeTransform {

  transform(segments: string[] = [], values: {}[] = []): string {
    let route = '';

    segments.forEach(segment => {
      const viewRoute = ViewRoute[segment];

      // If there is a view route defined
      if (viewRoute) {
        // Split route segments by /
        const viewRouteSegments: string[] = viewRoute.split('/');

        viewRouteSegments.forEach(viewRouteSegment => {
          // If segment starts with : is considered value
          if (startsWith(viewRouteSegment, ':')) {
            // Remove : from segment
            let identifier = replace(viewRouteSegment, ':', '');

            // Check if is obligatory or optional
            const isRequired = !startsWith(identifier, '?');

            // Remove ? from segment
            identifier = replace(identifier, '?', '');

            // Try replace value
            const value = values[0] && values[0][segment] ? (values[0][segment][identifier] || null) : null;

            if (value) {
              // replace
              route += `/${value}`;
            } else {
              if (isRequired) {
                throw new Error(`Missing "${identifier}" value for ${segment} view route`);
              }
            }
            // Otherwise set segment to route
          } else {
            route += `/${viewRouteSegment}`;
          }
        });

        // Otherwise use provided segment
      } else {
        route += `/${segment}`;
      }
    });

    return route;
  }

}
