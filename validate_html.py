from html.parser import HTMLParser
import pathlib

class Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.errors = []

    def handle_starttag(self, tag, attrs):
        if tag in ('area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'):
            return
        self.stack.append((tag, self.getpos()))

    def handle_startendtag(self, tag, attrs):
        pass

    def handle_endtag(self, tag):
        if not self.stack:
            self.errors.append(f'Unexpected closing </{tag}> at {self.getpos()}')
            return
        last, pos = self.stack.pop()
        if last != tag:
            self.errors.append(f'Closing </{tag}> at {self.getpos()} does not match opening <{last}> at {pos}')

    def close(self):
        super().close()
        if self.stack:
            self.errors.append('Unclosed tags: ' + ', '.join(t for t, pos in self.stack))

for filename in ['velox.html', 'project.html']:
    path = pathlib.Path(filename)
    text = path.read_text(encoding='utf-8')
    parser = Parser()
    parser.feed(text)
    parser.close()
    print(filename)
    print('errors:', parser.errors)
