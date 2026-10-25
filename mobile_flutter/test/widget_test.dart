import 'package:flutter_test/flutter_test.dart';
import 'package:lets_volunteer_app/main.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const LetsVolunteerApp());
    expect(find.byType(LetsVolunteerApp), findsOneWidget);
  });
}
